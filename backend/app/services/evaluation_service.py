import json
import re

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.evaluation import CriterionScore, Evaluation
from app.models.rubric import Rubric
from app.models.submission import Submission
from app.schemas.evaluation import CriterionResult, EvaluationResponse


def _normalize(value: float, max_score: int) -> int:
    return max(0, min(max_score, round(value)))


def _score_structure(text: str, max_score: int) -> tuple[int, str]:
    paragraphs = [p.strip() for p in text.split("\n") if p.strip()]
    score = max_score * 0.5
    if len(paragraphs) >= 3:
        score += max_score * 0.2
    if len(paragraphs) >= 5:
        score += max_score * 0.1
    if any(word in text.lower() for word in ["introduction", "conclusion", "firstly", "finally"]):
        score += max_score * 0.1
    if len(text.split()) > 180:
        score += max_score * 0.1
    return _normalize(score, max_score), (
        "Essay has visible paragraph structure, but transitions and section balance can still improve."
    )


def _score_clarity(text: str, max_score: int) -> tuple[int, str]:
    sentences = [s.strip() for s in re.split(r"[.!?]+", text) if s.strip()]
    if not sentences:
        return 0, "No clear sentence structure detected."

    avg_words = sum(len(s.split()) for s in sentences) / max(1, len(sentences))
    score = max_score * 0.6
    if 8 <= avg_words <= 20:
        score += max_score * 0.25
    elif avg_words <= 28:
        score += max_score * 0.15

    if len(set(text.lower().split())) > 40:
        score += max_score * 0.1

    return _normalize(score, max_score), (
        "Most ideas are understandable, but some sentences may be too long or indirect."
    )


def _score_content(text: str, max_score: int) -> tuple[int, str]:
    words = text.split()
    score = max_score * 0.45
    if len(words) > 120:
        score += max_score * 0.2
    if len(words) > 220:
        score += max_score * 0.15
    if len(set(w.lower().strip(",.?!") for w in words)) > 60:
        score += max_score * 0.15
    return _normalize(score, max_score), (
        "Essay shows topic development, but stronger evidence or depth would improve content quality."
    )


def _score_grammar(text: str, max_score: int) -> tuple[int, str]:
    score = max_score * 0.65
    if "  " not in text:
        score += max_score * 0.05
    if not re.search(r"[a-z][A-Z]", text):
        score += max_score * 0.05
    if len(re.findall(r"[.!?]", text)) >= 4:
        score += max_score * 0.1
    if len(text.split()) > 80:
        score += max_score * 0.1
    return _normalize(score, max_score), (
        "Grammar and readability are acceptable overall, though phrasing can be polished further."
    )


def _score_relevance(text: str, title: str, max_score: int) -> tuple[int, str]:
    title_terms = {t.lower() for t in re.findall(r"\w+", title) if len(t) > 3}
    essay_terms = {t.lower() for t in re.findall(r"\w+", text)}
    overlap = len(title_terms & essay_terms)

    score = max_score * 0.55
    if overlap >= 2:
        score += max_score * 0.2
    if overlap >= 4:
        score += max_score * 0.15
    return _normalize(score, max_score), (
        "The response is reasonably aligned with the topic, but tighter focus would improve relevance."
    )


def _score_by_name(name: str, text: str, title: str, max_score: int) -> tuple[int, str]:
    key = name.strip().lower()
    if "structure" in key:
        return _score_structure(text, max_score)
    if "clarity" in key:
        return _score_clarity(text, max_score)
    if "content" in key:
        return _score_content(text, max_score)
    if "grammar" in key or "readability" in key:
        return _score_grammar(text, max_score)
    if "relevance" in key or "topic" in key:
        return _score_relevance(text, title, max_score)

    score = int(max_score * 0.75)
    return score, f"{name} is satisfactory overall, with room for more refinement."


def _score_label(score: int) -> str:
    if score >= 90:
        return "Excellent"
    if score >= 80:
        return "Very Good"
    if score >= 70:
        return "Good"
    if score >= 60:
        return "Needs Improvement"
    return "Poor"


def run_evaluation(db: Session, submission_id: int) -> EvaluationResponse:
    submission = db.query(Submission).filter(Submission.id == submission_id).first()
    if not submission:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Submission not found")

    rubric = db.query(Rubric).filter(Rubric.id == submission.rubric_id).first()
    if not rubric:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Rubric not found")

    if not rubric.criteria:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Rubric has no criteria")

    existing = db.query(Evaluation).filter(Evaluation.submission_id == submission_id).first()
    if existing:
        db.query(CriterionScore).filter(CriterionScore.evaluation_id == existing.id).delete()
        db.delete(existing)
        db.commit()

    criterion_results: list[CriterionResult] = []
    raw_scores: list[float] = []

    for criterion in sorted(rubric.criteria, key=lambda item: item.order_index):
        score, justification = _score_by_name(
            criterion.name,
            submission.essay_text,
            submission.title,
            criterion.max_score,
        )
        raw_scores.append((score / max(criterion.max_score, 1)) * criterion.weight * 100)
        criterion_results.append(
            CriterionResult(
                criterion_id=criterion.id,
                name=criterion.name,
                score=score,
                max_score=criterion.max_score,
                weight=criterion.weight,
                justification=justification,
            )
        )

    overall_score = round(sum(raw_scores))
    strengths = [
        "Clear attempt to address the topic",
        "Basic essay structure is present",
        "The response has usable academic content",
    ]
    weaknesses = [
        "Transitions between ideas can be improved",
        "Some phrasing may be too broad or repetitive",
        "Certain arguments need stronger clarity or support",
    ]
    suggestions = [
        "Add stronger topic sentences to each paragraph",
        "Use shorter and cleaner sentences for readability",
        "Support claims with more specific examples or explanations",
    ]
    improved_version_text = (
        "This essay presents a relevant discussion of the topic, but it can be improved by using clearer "
        "paragraph transitions, more precise sentence structure, and stronger supporting points for each main idea."
    )
    summary_feedback = (
        "The essay demonstrates a fair understanding of the topic and follows a recognizable structure. "
        "Its strongest area is general content coverage, while clarity and depth can still be improved."
    )

    evaluation = Evaluation(
        submission_id=submission.id,
        overall_score=overall_score,
        score_label=_score_label(overall_score),
        summary_feedback=summary_feedback,
        strengths_json=json.dumps(strengths),
        weaknesses_json=json.dumps(weaknesses),
        suggestions_json=json.dumps(suggestions),
        improved_version_text=improved_version_text,
        confidence_score=0.84,
    )
    db.add(evaluation)
    db.flush()

    for result in criterion_results:
        db.add(
            CriterionScore(
                evaluation_id=evaluation.id,
                rubric_criterion_id=result.criterion_id,
                criterion_name=result.name,
                score=result.score,
                max_score=result.max_score,
                weight=result.weight,
                justification=result.justification,
            )
        )

    submission.status = "evaluated"
    db.commit()

    return EvaluationResponse(
        submission_id=submission.id,
        title=submission.title,
        overall_score=evaluation.overall_score,
        score_label=evaluation.score_label,
        confidence_score=evaluation.confidence_score,
        criteria=criterion_results,
        strengths=strengths,
        weaknesses=weaknesses,
        suggestions=suggestions,
        improved_version_text=improved_version_text,
        summary_feedback=summary_feedback,
        status="completed",
    )


def get_evaluation(db: Session, submission_id: int) -> EvaluationResponse:
    submission = db.query(Submission).filter(Submission.id == submission_id).first()
    evaluation = db.query(Evaluation).filter(Evaluation.submission_id == submission_id).first()

    if not submission or not evaluation:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Evaluation not found")

    scores = db.query(CriterionScore).filter(CriterionScore.evaluation_id == evaluation.id).all()

    return EvaluationResponse(
        submission_id=submission.id,
        title=submission.title,
        overall_score=evaluation.overall_score,
        score_label=evaluation.score_label,
        confidence_score=evaluation.confidence_score,
        criteria=[
            CriterionResult(
                criterion_id=item.rubric_criterion_id,
                name=item.criterion_name,
                score=item.score,
                max_score=item.max_score,
                weight=item.weight,
                justification=item.justification,
            )
            for item in scores
        ],
        strengths=json.loads(evaluation.strengths_json),
        weaknesses=json.loads(evaluation.weaknesses_json),
        suggestions=json.loads(evaluation.suggestions_json),
        improved_version_text=evaluation.improved_version_text,
        summary_feedback=evaluation.summary_feedback,
        status="completed",
    )
