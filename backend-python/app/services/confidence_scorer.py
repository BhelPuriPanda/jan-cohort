def score_field(value):
    if not value:
        return 0
    if isinstance(value, list) and len(value) == 0:
        return 30
    return 80