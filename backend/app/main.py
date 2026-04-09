from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.auth import router as auth_router
from app.api.dashboard import router as dashboard_router
from app.api.evaluations import router as evaluations_router
from app.api.rubrics import router as rubrics_router
from app.api.submissions import router as submissions_router
from app.core.config import settings
from app.core.database import Base, SessionLocal, engine
from app.models import Rubric, RubricCriterion, User

app = FastAPI(title=settings.app_name)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)


def seed_demo_data():
    db = SessionLocal()
    try:
        if not db.query(User).first():
            from app.services.auth_service import hash_password

            student = User(
                name="Demo Student",
                email="student@example.com",
                password_hash=hash_password("123456"),
                role="student",
            )
            faculty = User(
                name="Demo Faculty",
                email="faculty@example.com",
                password_hash=hash_password("123456"),
                role="faculty",
            )
            db.add_all([student, faculty])
            db.flush()

            rubric = Rubric(
                title="Essay Writing Evaluation",
                subject="English",
                description="General rubric for academic short essay evaluation",
                created_by=faculty.id,
            )
            db.add(rubric)
            db.flush()

            criteria = [
                RubricCriterion(
                    rubric_id=rubric.id,
                    name="Structure",
                    description="Intro, body, conclusion flow",
                    max_score=20,
                    weight=0.2,
                    order_index=1,
                ),
                RubricCriterion(
                    rubric_id=rubric.id,
                    name="Clarity",
                    description="Sentence clarity and idea flow",
                    max_score=20,
                    weight=0.2,
                    order_index=2,
                ),
                RubricCriterion(
                    rubric_id=rubric.id,
                    name="Content Quality",
                    description="Depth and topic development",
                    max_score=20,
                    weight=0.25,
                    order_index=3,
                ),
                RubricCriterion(
                    rubric_id=rubric.id,
                    name="Grammar / Readability",
                    description="Grammar and readability quality",
                    max_score=20,
                    weight=0.2,
                    order_index=4,
                ),
                RubricCriterion(
                    rubric_id=rubric.id,
                    name="Relevance to Topic",
                    description="Topic focus and alignment",
                    max_score=20,
                    weight=0.15,
                    order_index=5,
                ),
            ]
            db.add_all(criteria)
            db.commit()
    finally:
        db.close()


seed_demo_data()

app.include_router(auth_router)
app.include_router(rubrics_router)
app.include_router(submissions_router)
app.include_router(evaluations_router)
app.include_router(dashboard_router)


@app.get("/api/health")
def health():
    return {"status": "ok", "app": settings.app_name}
