# Contributing to Gursha

Thank you for your interest in contributing to Gursha! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and grow
- Focus on the code, not the person

## Getting Started

### Prerequisites

- Python 3.8+
- Git
- PyTorch 2.0+
- Familiarity with deep learning and computer vision

### Development Setup

1. **Fork the repository**
   ```bash
   # Click fork button on GitHub
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/gursha.git
   cd gursha
   ```

3. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/gursha.git
   ```

4. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # or venv\Scripts\activate on Windows
   ```

5. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   pip install pytest black flake8  # Development tools
   ```

## Development Workflow

### 1. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

Branch naming conventions:
- `feature/`: New features
- `bugfix/`: Bug fixes
- `docs/`: Documentation improvements
- `refactor/`: Code refactoring
- `test/`: Test additions

### 2. Make Changes

- Follow PEP 8 style guide
- Write descriptive commit messages
- Add comments for complex logic
- Include docstrings for functions

### 3. Commit Changes

```bash
git add .
git commit -m "Brief description of changes

Detailed explanation if needed.
- Mention related issues: Fixes #123
- Include any breaking changes
"
```

### 4. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 5. Create Pull Request

- Go to GitHub and create a pull request
- Fill in the PR template
- Link to related issues
- Request review from maintainers

## Code Style

### Python Style Guide

- Follow PEP 8
- Use 4 spaces for indentation
- Max line length: 88 characters
- Use type hints where applicable

### Formatting

```bash
# Format code with black
black train.py predict_food.py app.py

# Lint code with flake8
flake8 train.py predict_food.py app.py
```

### Docstrings

Use Google-style docstrings:

```python
def predict(self, image_path: str, top_k: int = 3) -> Dict:
    """
    Predict food category for an image.
    
    Args:
        image_path (str): Path to image file
        top_k (int): Number of top predictions to return
    
    Returns:
        dict: Prediction results with:
            - predicted_food: Top prediction
            - confidence: Confidence score
            - top_k_predictions: All top-k predictions
    
    Raises:
        FileNotFoundError: If image file not found
        ValueError: If image format is invalid
    """
```

## Testing

### Writing Tests

1. Create test file: `test_*.py`
2. Use pytest framework
3. Aim for >80% code coverage

Example:

```python
import pytest
from predict_food import EthiopianFoodPredictor

def test_predictor_initialization():
    """Test predictor loads correctly"""
    predictor = EthiopianFoodPredictor()
    assert predictor.num_classes == 11
    assert predictor.model is not None

def test_prediction_output_format():
    """Test prediction returns correct format"""
    predictor = EthiopianFoodPredictor()
    result = predictor.predict("test_image.jpg")
    
    assert 'predicted_food' in result
    assert 'confidence' in result
    assert 'top_k_predictions' in result
    assert 0 <= result['confidence'] <= 1
```

### Running Tests

```bash
# Run all tests
pytest

# Run specific test file
pytest test_predict_food.py

# Run with coverage
pytest --cov=. --cov-report=html
```

## Documentation

### README Updates

- Keep README.md up to date
- Add examples for new features
- Include troubleshooting for common issues

### Code Comments

- Comment complex algorithms
- Explain non-obvious design decisions
- Use clear, concise language

Example:

```python
# Calculate per-class accuracy for imbalanced dataset analysis
# Group predictions by class and compute accuracy separately
per_class_acc = {}
for class_idx in range(num_classes):
    class_mask = np.array(labels) == class_idx
    if class_mask.sum() > 0:
        class_accuracy = np.array(predictions)[class_mask] == class_idx
        per_class_acc[class_idx] = 100 * class_accuracy.mean()
```

## Pull Request Process

### Before Submitting

1. **Update from upstream**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Run tests**
   ```bash
   pytest
   black --check .
   flake8 .
   ```

3. **Update documentation**
   - README.md if needed
   - Docstrings
   - Comments

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issues
Fixes #123

## How Has This Been Tested?
- Test 1
- Test 2

## Checklist
- [ ] Tests pass
- [ ] Code formatted with black
- [ ] Linting passes (flake8)
- [ ] Documentation updated
- [ ] No new warnings
```

### Review Process

- Maintainers will review code
- Feedback will be provided
- Make requested changes
- Repeat until approval

## Types of Contributions

### 1. Bug Reports

Create an issue with:
- Clear description
- Steps to reproduce
- Expected behavior
- Actual behavior
- Environment (Python, PyTorch, GPU info)

### 2. Feature Requests

Create an issue with:
- Feature description
- Use case
- Proposed implementation
- Alternatives considered

### 3. Code Improvements

- Performance optimizations
- Code cleanup
- Refactoring
- Better error messages

### 4. Documentation

- README improvements
- Code examples
- Troubleshooting guides
- API documentation

## Areas for Contribution

### High Priority

- [ ] Model compression (quantization, pruning)
- [ ] Mobile optimization
- [ ] Extended model support
- [ ] Ensemble methods
- [ ] Web UI for training

### Medium Priority

- [ ] More comprehensive tests
- [ ] Performance benchmarks
- [ ] Additional datasets
- [ ] Data augmentation strategies
- [ ] Monitoring/logging improvements

### Low Priority

- [ ] Code style improvements
- [ ] Documentation enhancements
- [ ] Example notebooks
- [ ] Community content

## Questions?

- Check existing issues and discussions
- Read the README.md
- Review code comments
- Open an issue for questions

## Attribution

Contributors will be recognized in:
- README.md Contributors section
- GitHub contributors page
- Release notes

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to make Gursha better! 🎉
