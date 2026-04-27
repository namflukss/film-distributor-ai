function scoreFilmFestival(profile, festival) {
  let score = 0;
  const reasons = [];

  // Genre fit (0-25)
  const profGenres = profile.genres || [];
  const festGenres = festival.genres || [];
  const genreOverlap = profGenres.filter(g => festGenres.includes(g)).length;
  if (genreOverlap > 0) {
    const genreScore = Math.min(25, genreOverlap * 12);
    score += genreScore;
    reasons.push(`Genre match: ${genreOverlap} shared genres (+${genreScore})`);
  }

  // Runtime compatibility (0-10)
  const runtime = profile.runtime || 0;
  const rMin = festival.runtime_min || 0;
  const rMax = festival.runtime_max || 999;
  if (runtime >= rMin && runtime <= rMax) {
    score += 10;
    reasons.push('Runtime fits (+10)');
  } else if (runtime > 0 && (runtime < rMin - 10 || runtime > rMax + 10)) {
    score -= 15;
    reasons.push('Runtime outside range (-15)');
  }

  // Tier vs director experience (0-20)
  const dirBg = profile.director_background;
  const tier = festival.tier;
  let tierScore = 0;
  if (dirBg === 'established' && tier === 1) tierScore = 20;
  else if (dirBg === 'established' && tier === 2) tierScore = 15;
  else if (dirBg === 'emerging' && tier <= 2) tierScore = 18;
  else if (dirBg === 'emerging' && tier === 3) tierScore = 12;
  else if (dirBg === 'first-time' && tier === 3) tierScore = 20;
  else if (dirBg === 'first-time' && tier === 2) tierScore = 12;
  else if (dirBg === 'first-time' && tier === 1) tierScore = 5;
  score += tierScore;
  if (tierScore > 0) reasons.push(`Director/tier match (+${tierScore})`);

  // Premiere compatibility (0-15)
  const premiereStatus = profile.premiere_status;
  if (premiereStatus === 'world') {
    score += 15;
    reasons.push('World premiere available (+15)');
  } else if (premiereStatus === 'north_american') {
    if (festival.location?.includes('USA') || festival.location?.includes('Canada')) {
      score += 10;
      reasons.push('NA premiere available for NA festival (+10)');
    } else score += 5;
  } else if (premiereStatus === 'already_screened') {
    if (tier === 1) { score -= 20; reasons.push('Already screened hurts T1 (-20)'); }
    else if (tier === 2) { score -= 5; reasons.push('Already screened minor impact (-5)'); }
    else { score += 5; reasons.push('Previous screenings OK for T3 (+5)'); }
  }

  // Budget/fee affordability (0-10)
  const subBudget = profile.submission_budget || 0;
  const regularFee = festival.fee_regular || 0;
  if (regularFee === 0) { score += 10; reasons.push('Free submission (+10)'); }
  else if (subBudget > 0 && regularFee <= subBudget * 0.1) { score += 10; reasons.push('Affordable fee (+10)'); }
  else if (subBudget > 0 && regularFee <= subBudget * 0.2) { score += 6; reasons.push('Manageable fee (+6)'); }
  else if (subBudget === 0 || regularFee <= 100) { score += 4; reasons.push('Standard fee (+4)'); }

  // Goal alignment (0-20)
  const goals = profile.goals || [];
  let goalScore = 0;
  if (goals.includes('distribution') && festival.distribution_impact === 'very high') goalScore += 20;
  else if (goals.includes('distribution') && festival.distribution_impact === 'high') goalScore += 14;
  else if (goals.includes('distribution') && festival.distribution_impact === 'medium') goalScore += 8;
  if (goals.includes('awards') && festival.prestige >= 9) goalScore = Math.max(goalScore, 18);
  if (goals.includes('international') && !festival.location?.includes('USA')) goalScore = Math.max(goalScore, 12);
  if (goals.includes('audience') && tier <= 2) goalScore = Math.max(goalScore, 10);
  score += Math.min(20, goalScore);
  if (goalScore > 0) reasons.push(`Goal alignment (+${Math.min(20, goalScore)})`);

  // Subject tag bonus
  const profTags = profile.subject_tags || [];
  const festTags = festival.subject_tags || [];
  const tagOverlap = profTags.filter(t => festTags.includes(t)).length;
  if (tagOverlap > 0) {
    const tagBonus = Math.min(10, tagOverlap * 5);
    score += tagBonus;
    reasons.push(`Subject tag match: ${tagOverlap} shared tags (+${tagBonus})`);
  }

  return { score: Math.max(0, Math.min(100, score)), reasons };
}

function rankFestivalsForFilm(profile, festivals) {
  return festivals
    .map(f => ({ festival: f, ...scoreFilmFestival(profile, f) }))
    .sort((a, b) => b.score - a.score);
}

module.exports = { scoreFilmFestival, rankFestivalsForFilm };
