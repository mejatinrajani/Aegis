# Aegis

Aegis is an AI-powered moderation and analysis assistant built on top of **MHPCD (Multimodal Hinglish Predatory Content Detector)**. By combining the reasoning capabilities of Google's Gemini models with MHPCD's domain-specific intelligence, Aegis delivers context-aware moderation, risk assessment, and conversational analysis for Indian social media environments.

---

## Overview

Traditional moderation systems struggle to understand the nuances of Hinglish (Hindi-English code-mixed language) and often fail to consider the visual context associated with social media content.

Aegis addresses this challenge by integrating:

- **Gemini LLM** for advanced reasoning and conversational intelligence
- **MHPCD** for multimodal predatory content detection
- **Vision-Language Analysis** for image-text understanding
- **Context-Aware Risk Assessment**
- **Hinglish Toxicity & Predatory Content Detection**

---

## Architecture

```text
User Input
    │
    ▼
   Aegis
    │
    ▼
 Gemini LLM
    │
    ▼
 MHPCD Engine
 ├── SigLIP Vision Encoder
 ├── BGE-M3 Text Encoder
 └── Fusion Classification Head
    │
    ▼
 Risk Assessment
    │
    ▼
 Context-Aware Response
```

---

## Key Features

### Multimodal Content Understanding
- Processes both images and text simultaneously.
- Understands visual context behind user comments.

### Hinglish Intelligence
- Designed specifically for Indian social media ecosystems.
- Handles Hindi-English code-mixed language effectively.

### Predatory Content Detection
- Identifies predatory, objectifying, and toxic interactions.
- Provides confidence-based risk analysis.

### LLM-Guided Moderation
- Combines structured detection from MHPCD with Gemini reasoning.
- Produces human-readable moderation insights.

### Context-Aware Analysis
- Understands when identical text may be safe or harmful depending on image context.

---

## MHPCD Core Model

MHPCD (Multimodal Hinglish Predatory Content Detector) utilizes:

### Vision Encoder
- Google SigLIP

### Text Encoder
- BAAI BGE-M3

### Fine-Tuning
- LoRA (Low-Rank Adaptation)

### Classification Pipeline

```text
Image → SigLIP → 768D Embedding
Text  → BGE-M3 → 1024D Embedding

Fusion Layer
      ↓
MLP Classifier
      ↓
Risk Prediction
```

---

## Project Structure

```text
Aegis/
│
├── backend/
├── frontend/
├── models/
│   └── mhpcd/
├── api/
├── docs/
├── assets/
├── screenshots/
│
├── requirements.txt
├── README.md
└── LICENSE
```

---

## Tech Stack

### Artificial Intelligence
- Gemini API
- SigLIP
- BGE-M3
- LoRA
- PyTorch
- Transformers
- PEFT

### Backend
- Python
- FastAPI / Flask

### Frontend
- React
- Next.js (Optional)

### Deployment
- Docker
- Cloud Platforms

---

## Use Cases

- Social Media Moderation
- Community Safety Tools
- AI Content Review Systems
- Educational Research
- Trust & Safety Platforms
- Multimodal Toxicity Analysis

---

## Future Roadmap

- Real-time moderation API
- Multi-language support
- Advanced threat categorization
- Video content moderation
- Audio moderation
- Explainable AI moderation reports
- Dashboard and analytics system

---

## Project Status

Aegis is currently under active development and construction. Features, architecture, and implementations may change as the project evolves.

---

## Author

**Jatin Rajani**

Computer Science Engineer | AI & Full Stack Developer

GitHub: https://github.com/mejatinrajani

---

## Support

If you find this project interesting, consider giving it a star and following future updates.
