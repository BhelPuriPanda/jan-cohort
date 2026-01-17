const confidence = (value, matches = 0) => {
  if (!value || (Array.isArray(value) && value.length === 0)) return 0;
  let score = 60;
  score += Math.min(matches * 10, 30);
  return Math.min(score, 100);
};

export default confidence;
