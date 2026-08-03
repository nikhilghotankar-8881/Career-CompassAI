"""
OneStop AI - Assessment Service
Core business logic for seeding questions, managing sessions, computing domain scores, and generating assessment results.
"""

from sqlalchemy.orm import Session
from datetime import datetime, timezone
from fastapi import HTTPException, status

from app.database.models import User, Question, Assessment, AssessmentAnswer, AssessmentResult
from app.schemas.assessment import AssessmentSubmitRequest, SingleAnswerSubmission


DEFAULT_QUESTIONS = [
    # --- Category 1: Personality & Work Style ---
    {
        "category": "personality",
        "sub_domain": "Analytical",
        "question_text": "When presented with a complex problem at work or study, what is your initial instinct?",
        "order_index": 1,
        "options": [
            {"label": "Break it down into data, patterns, and logical components", "score_vector": {"Analytical": 25, "Technical": 15}},
            {"label": "Brainstorm creative and unconventional out-of-the-box ideas", "score_vector": {"Creative": 25, "Analytical": 10}},
            {"label": "Discuss with team members to gather diverse perspectives", "score_vector": {"Collaborative": 25, "Leadership": 15}},
            {"label": "Take quick action and test potential solutions right away", "score_vector": {"Leadership": 20, "Technical": 15}},
        ]
    },
    {
        "category": "personality",
        "sub_domain": "Collaborative",
        "question_text": "How do you perform best during team projects and group assignments?",
        "order_index": 2,
        "options": [
            {"label": "Leading the team, delegating tasks, and maintaining deadlines", "score_vector": {"Leadership": 25, "Collaborative": 15}},
            {"label": "Analyzing technical specs and executing core deliverables quietly", "score_vector": {"Technical": 25, "Analytical": 15}},
            {"label": "Facilitating communication, resolving friction, and building consensus", "score_vector": {"Collaborative": 25, "Leadership": 10}},
            {"label": "Designing the visual presentation and framing story points", "score_vector": {"Creative": 25, "Collaborative": 10}},
        ]
    },
    {
        "category": "personality",
        "sub_domain": "Work Style",
        "question_text": "What type of working environment empowers you to do your best work?",
        "order_index": 3,
        "options": [
            {"label": "Structured, data-driven, with well-defined metrics and targets", "score_vector": {"Analytical": 25, "Technical": 15}},
            {"label": "Fast-paced startup setting with high autonomy and experimentation", "score_vector": {"Leadership": 20, "Creative": 20}},
            {"label": "Collaborative agency or team studio focused on creative output", "score_vector": {"Creative": 25, "Collaborative": 20}},
            {"label": "Research-focused environment solving challenging multi-faceted problems", "score_vector": {"Technical": 25, "Analytical": 20}},
        ]
    },
    {
        "category": "personality",
        "sub_domain": "Decision Making",
        "question_text": "How do you make important career or academic choices?",
        "order_index": 4,
        "options": [
            {"label": "Conducting thorough quantitative research, pros/cons analysis", "score_vector": {"Analytical": 25}},
            {"label": "Following personal passion, intuition, and creative vision", "score_vector": {"Creative": 25}},
            {"label": "Seeking advice from mentors, peers, and industry networks", "score_vector": {"Collaborative": 25}},
            {"label": "Evaluating high-growth market demand and leadership opportunities", "score_vector": {"Leadership": 25}},
        ]
    },
    {
        "category": "personality",
        "sub_domain": "Adaptability",
        "question_text": "How do you handle unexpected project requirements or sudden pivot requests?",
        "order_index": 5,
        "options": [
            {"label": "Systematically map out updated specs and recalibrate plans", "score_vector": {"Analytical": 20, "Technical": 15}},
            {"label": "Embrace the shift enthusiastically and brainstorm novel approaches", "score_vector": {"Creative": 25, "Leadership": 10}},
            {"label": "Rally the team together to realign responsibilities seamlessly", "score_vector": {"Leadership": 20, "Collaborative": 20}},
            {"label": "Dive deep into documentation and master new required skills", "score_vector": {"Technical": 25}},
        ]
    },

    # --- Category 2: Technical & Problem Solving Skills ---
    {
        "category": "skill",
        "sub_domain": "Technical",
        "question_text": "Which technical activity gives you the greatest sense of accomplishment?",
        "order_index": 6,
        "options": [
            {"label": "Building software architecture, coding apps, or crafting algorithms", "score_vector": {"Technical": 25, "Analytical": 15}},
            {"label": "Extracting insights from complex datasets and visualizing trends", "score_vector": {"Analytical": 25, "Technical": 15}},
            {"label": "Designing intuitive user interfaces and digital user experiences", "score_vector": {"Creative": 25, "Technical": 10}},
            {"label": "Managing digital products, roadmaps, and stakeholder alignment", "score_vector": {"Leadership": 25, "Collaborative": 15}},
        ]
    },
    {
        "category": "skill",
        "sub_domain": "Analytical",
        "question_text": "How comfortable are you working with quantitative logic and mathematical modeling?",
        "order_index": 7,
        "options": [
            {"label": "Extremely comfortable – I thrive on numbers, statistics, and logic", "score_vector": {"Analytical": 25, "Technical": 20}},
            {"label": "Comfortable – I use data to support decisions when necessary", "score_vector": {"Analytical": 15, "Leadership": 10}},
            {"label": "Moderate – I prefer qualitative analysis and strategic thinking", "score_vector": {"Creative": 15, "Leadership": 15}},
            {"label": "Basic – I prefer visual, verbal, or interpersonal execution", "score_vector": {"Collaborative": 20, "Creative": 15}},
        ]
    },
    {
        "category": "skill",
        "sub_domain": "Creative",
        "question_text": "Which creative or technical design tools do you enjoy working with?",
        "order_index": 8,
        "options": [
            {"label": "UI/UX design tools (Figma, Adobe XD, Canva, CSS/Tailwind)", "score_vector": {"Creative": 25, "Technical": 15}},
            {"label": "Programming IDEs & frameworks (Python, React, Node, SQL)", "score_vector": {"Technical": 25, "Analytical": 15}},
            {"label": "Data visualization tools (Tableau, PowerBI, Pandas, Excel)", "score_vector": {"Analytical": 25, "Technical": 15}},
            {"label": "Project & workflow tools (Jira, Notion, Trello, Asana)", "score_vector": {"Leadership": 20, "Collaborative": 20}},
        ]
    },
    {
        "category": "skill",
        "sub_domain": "Problem Solving",
        "question_text": "When code or a complex workflow encounters a critical bug, how do you debug it?",
        "order_index": 9,
        "options": [
            {"label": "Isolate variables step-by-step using diagnostic logging", "score_vector": {"Technical": 25, "Analytical": 20}},
            {"label": "Search docs, online forums, and leverage AI code helpers", "score_vector": {"Technical": 20, "Creative": 10}},
            {"label": "Pair program with a peer to discuss edge cases together", "score_vector": {"Collaborative": 25, "Technical": 10}},
            {"label": "Rethink the whole feature design and re-architect the flow", "score_vector": {"Creative": 20, "Leadership": 15}},
        ]
    },
    {
        "category": "skill",
        "sub_domain": "Communication",
        "question_text": "How effectively can you explain complex technical concepts to non-technical audiences?",
        "order_index": 10,
        "options": [
            {"label": "Effortlessly – I bridge business goals and engineering details smoothly", "score_vector": {"Leadership": 25, "Collaborative": 20}},
            {"label": "Very well – I rely on clear visual aids and simple analogies", "score_vector": {"Creative": 20, "Collaborative": 20}},
            {"label": "Well – I focus on precise technical documentation and specs", "score_vector": {"Analytical": 20, "Technical": 15}},
            {"label": "Developing – I prefer communicating via code and written reports", "score_vector": {"Technical": 20, "Analytical": 15}},
        ]
    },

    # --- Category 3: Career Interests & Motivation ---
    {
        "category": "interest",
        "sub_domain": "Industry Focus",
        "question_text": "Which tech domain excites you most for your long-term career?",
        "order_index": 11,
        "options": [
            {"label": "Artificial Intelligence, Machine Learning & Data Science", "score_vector": {"Analytical": 25, "Technical": 25}},
            {"label": "Full-Stack Web & Mobile Application Development", "score_vector": {"Technical": 25, "Creative": 15}},
            {"label": "Product Management, Tech Entrepreneurship & Strategy", "score_vector": {"Leadership": 25, "Collaborative": 20}},
            {"label": "UI/UX Design, Product Design & Frontend Craft", "score_vector": {"Creative": 25, "Collaborative": 15}},
        ]
    },
    {
        "category": "interest",
        "sub_domain": "Growth Goals",
        "question_text": "What is your primary milestone for the next 1–2 years?",
        "order_index": 12,
        "options": [
            {"label": "Mastering advanced modern tech stacks and building production systems", "score_vector": {"Technical": 25}},
            {"label": "Becoming an expert in data modeling, AI pipelines, or analytics", "score_vector": {"Analytical": 25}},
            {"label": "Leading cross-functional engineering teams or founding a startup", "score_vector": {"Leadership": 25}},
            {"label": "Creating impactful digital products with top-notch user experience", "score_vector": {"Creative": 25}},
        ]
    },
    {
        "category": "interest",
        "sub_domain": "Work Impact",
        "question_text": "What gives you the highest satisfaction in your day-to-day work?",
        "order_index": 13,
        "options": [
            {"label": "Solving algorithmic challenges and shipping elegant code", "score_vector": {"Technical": 25, "Analytical": 15}},
            {"label": "Uncovering actionable insights that drive business decisions", "score_vector": {"Analytical": 25, "Leadership": 15}},
            {"label": "Delivering beautiful, accessible, and delightful interfaces", "score_vector": {"Creative": 25, "Collaborative": 15}},
            {"label": "Enabling team growth, unblocking bottlenecks, and driving goals", "score_vector": {"Leadership": 25, "Collaborative": 20}},
        ]
    },
    {
        "category": "interest",
        "sub_domain": "Learning Style",
        "question_text": "How do you prefer to acquire new skills and technologies?",
        "order_index": 14,
        "options": [
            {"label": "Hands-on project building and trial-and-error execution", "score_vector": {"Technical": 20, "Creative": 15}},
            {"label": "Structured online courses, textbooks, and documentation analysis", "score_vector": {"Analytical": 25, "Technical": 15}},
            {"label": "Bootcamps, hackathons, and collaborative group coding", "score_vector": {"Collaborative": 25, "Leadership": 15}},
            {"label": "Mentorship, peer code reviews, and industry workshops", "score_vector": {"Leadership": 20, "Collaborative": 20}},
        ]
    },
    {
        "category": "interest",
        "sub_domain": "Career Vision",
        "question_text": "Where do you see yourself in 5 years?",
        "order_index": 15,
        "options": [
            {"label": "Principal Software Engineer or Technical Architect", "score_vector": {"Technical": 25, "Analytical": 20}},
            {"label": "Lead AI / Data Scientist driving core intelligent features", "score_vector": {"Analytical": 25, "Technical": 20}},
            {"label": "VP of Product, Engineering Manager, or Founder", "score_vector": {"Leadership": 25, "Collaborative": 20}},
            {"label": "Design Director or Product Design Lead", "score_vector": {"Creative": 25, "Collaborative": 15}},
        ]
    },
]


def seed_questions_if_empty(db: Session):
    """Seed default assessment questions if questions table is empty."""
    existing_count = db.query(Question).count()
    if existing_count == 0:
        for item in DEFAULT_QUESTIONS:
            q = Question(
                category=item["category"],
                sub_domain=item["sub_domain"],
                question_text=item["question_text"],
                options=item["options"],
                order_index=item["order_index"],
            )
            db.add(q)
        db.commit()


def get_all_questions(db: Session) -> list[Question]:
    """Retrieve all active assessment questions ordered by order_index."""
    seed_questions_if_empty(db)
    return db.query(Question).order_by(Question.order_index.asc()).all()


def get_or_create_active_assessment(db: Session, user: User) -> tuple[Assessment, list[Question]]:
    """Fetch active in_progress assessment session or create a new one."""
    seed_questions_if_empty(db)
    questions = get_all_questions(db)

    active_assessment = (
        db.query(Assessment)
        .filter(Assessment.user_id == user.id, Assessment.status == "in_progress")
        .order_index_by(Assessment.created_at.desc()) if hasattr(Assessment, 'order_index_by') else
        db.query(Assessment)
        .filter(Assessment.user_id == user.id, Assessment.status == "in_progress")
        .order_by(Assessment.created_at.desc())
        .first()
    )

    if not active_assessment:
        active_assessment = Assessment(user_id=user.id, status="in_progress")
        db.add(active_assessment)
        db.commit()
        db.refresh(active_assessment)

    return active_assessment, questions


def process_assessment_submission(db: Session, user: User, submit_data: AssessmentSubmitRequest) -> AssessmentResult:
    """Process submitted answers, calculate category scores, and generate assessment result."""
    assessment = (
        db.query(Assessment)
        .filter(Assessment.id == submit_data.assessment_id, Assessment.user_id == user.id)
        .first()
    )

    if not assessment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assessment session not found or access denied."
        )

    # Delete any previous answers for this assessment session
    db.query(AssessmentAnswer).filter(AssessmentAnswer.assessment_id == assessment.id).delete()

    domain_totals = {
        "Analytical": 0,
        "Technical": 0,
        "Creative": 0,
        "Leadership": 0,
        "Collaborative": 0,
    }
    domain_max = {
        "Analytical": 0,
        "Technical": 0,
        "Creative": 0,
        "Leadership": 0,
        "Collaborative": 0,
    }

    # Gather questions map for calculation
    questions = {q.id: q for q in db.query(Question).all()}

    for ans in submit_data.answers:
        q = questions.get(ans.question_id)
        if not q or not q.options:
            continue
        
        # Calculate max possible per question for normalization
        for opt in q.options:
            sv = opt.get("score_vector", {})
            for d, val in sv.items():
                if d in domain_max:
                    domain_max[d] = max(domain_max[d], val)

        if 0 <= ans.selected_option_index < len(q.options):
            selected_opt = q.options[ans.selected_option_index]
            score_vec = selected_opt.get("score_vector", {})
            
            # Save answer DB entry
            db_ans = AssessmentAnswer(
                assessment_id=assessment.id,
                question_id=q.id,
                selected_option_index=ans.selected_option_index,
                score_vector=score_vec,
            )
            db.add(db_ans)

            for d, val in score_vec.items():
                if d in domain_totals:
                    domain_totals[d] += val

    # Calculate percentage normalized scores (0-100)
    category_scores = {}
    for domain, raw in domain_totals.items():
        # Baseline max estimate per domain across 15 questions is around 125
        normalized = min(100, max(20, int((raw / 120.0) * 100)))
        category_scores[domain] = normalized

    # Determine top traits and personality archetype
    sorted_domains = sorted(category_scores.items(), key=lambda x: x[1], reverse=True)
    top_domain_names = [d[0] for d in sorted_domains[:2]]

    trait_mapping = {
        "Analytical": ["Data-Driven Problem Solver", "Logical Investigator"],
        "Technical": ["Systems Architect", "Technical Builder"],
        "Creative": ["Creative Innovator", "User Experience Designer"],
        "Leadership": ["Strategic Leader", "Product Driver"],
        "Collaborative": ["Cross-Functional Integrator", "Team Facilitator"],
    }

    top_traits = []
    for d in top_domain_names:
        top_traits.extend(trait_mapping.get(d, [f"{d} Strategist"]))

    archetype_mapping = {
        ("Technical", "Analytical"): "Data & Systems Specialist",
        ("Analytical", "Technical"): "Quantitative Engineer",
        ("Technical", "Creative"): "Full-Stack Product Developer",
        ("Creative", "Technical"): "UX & Creative Engineer",
        ("Leadership", "Technical"): "Technical Product Manager",
        ("Leadership", "Collaborative"): "Agile Engineering Leader",
        ("Creative", "Collaborative"): "Product Experience Strategist",
    }

    primary_secondary = (top_domain_names[0], top_domain_names[1])
    personality_type = archetype_mapping.get(primary_secondary, f"{top_domain_names[0]} Specialist")

    domain_career_mapping = {
        "Technical": ["Full-Stack Software Engineering", "Cloud & Backend Architecture", "DevOps & Platform Engineering"],
        "Analytical": ["Artificial Intelligence & Machine Learning", "Data Science & Big Analytics", "Quantitative Research"],
        "Creative": ["UI/UX & Product Design", "Frontend Engineering & Design Systems", "Interactive Media Development"],
        "Leadership": ["Technical Product Management", "Tech Entrepreneurship & Strategy", "Scrum & Agile Management"],
        "Collaborative": ["Developer Relations", "Customer Success & Solution Engineering", "Technical Operations"],
    }

    recommended_domains = []
    for d in top_domain_names:
        recommended_domains.extend(domain_career_mapping.get(d, []))
    recommended_domains = recommended_domains[:3]

    summary = (
        f"Based on your assessment, your dominant profile is {personality_type} with strong strengths in "
        f"{', '.join(top_domain_names)}. You excel at systematic thinking, problem-solving, and executing high-impact solutions. "
        f"Your highest scoring domain is {top_domain_names[0]} ({category_scores[top_domain_names[0]]}%), followed by "
        f"{top_domain_names[1]} ({category_scores[top_domain_names[1]]}%). "
        f"We recommend exploring learning paths and career opportunities in {', '.join(recommended_domains)}."
    )

    # Delete old results for this user if exists
    db.query(AssessmentResult).filter(AssessmentResult.user_id == user.id).delete()

    result = AssessmentResult(
        assessment_id=assessment.id,
        user_id=user.id,
        category_scores=category_scores,
        top_traits=top_traits,
        personality_type=personality_type,
        recommended_domains=recommended_domains,
        summary=summary,
    )
    db.add(result)

    # Mark assessment session completed
    assessment.status = "completed"
    assessment.completed_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(result)
    return result


def get_user_latest_result(db: Session, user: User) -> AssessmentResult | None:
    """Retrieve user's latest completed assessment result."""
    return (
        db.query(AssessmentResult)
        .filter(AssessmentResult.user_id == user.id)
        .order_by(AssessmentResult.created_at.desc())
        .first()
    )
