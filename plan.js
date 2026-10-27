// Baby PupFit: evidence-informed machine-only physique training. Four priority lifting sessions, Wednesday optional accessories, optional after-work running and Sunday endurance. Existing logs are never rewritten.
// 2-3 RIR most sets; progressive overload only with complete quality reps and recoverable volume.
window.PUPFIT_PLANS = {
  "1": {
    "name": "💜 Upper A • Defined Abs + Shape",
    "note": "Weighted abs, upper chest, back and side delts. Use 2–3 reps in reserve. All machines/cables; 45–55 minutes with a warm-up.",
    "ex": [
      [
        "Incline Chest Press",
        3,
        8,
        12,
        "big"
      ],
      [
        "ISO-Lateral Lat Pulldown",
        3,
        8,
        12,
        "big"
      ],
      [
        "Cable Lateral Raise",
        2,
        12,
        20,
        "small"
      ],
      [
        "EGYM Row",
        2,
        8,
        12,
        "big"
      ],
      [
        "Ab Crunch Machine",
        3,
        10,
        15,
        "small"
      ]
    ]
  },
  "2": {
    "name": "🍑 Lower A • Glute Growth",
    "note": "Primary glute growth day: hip thrust and leg press, followed by abduction and hamstrings. Control each rep; avoid training to failure.",
    "ex": [
      [
        "Booty Builder Hip Thrust",
        3,
        8,
        12,
        "big"
      ],
      [
        "EGYM Leg Press",
        3,
        8,
        12,
        "big"
      ],
      [
        "Booty Builder Hip Abduction",
        3,
        12,
        20,
        "small"
      ],
      [
        "EGYM Leg Curl",
        3,
        10,
        15,
        "small"
      ]
    ]
  },
  "3": {
    "name": "🏃 Easy Run • Optional Recovery Accessories",
    "note": "Gym recovery day: light rear delts and curls, plus optional easy cardio. If running, do it after work at a conversational pace. Do not compromise Thursday glute training.",
    "ex": [
      [
        "Pec Fly / Rear-Delt Machine",
        2,
        12,
        20,
        "small"
      ],
      [
        "EGYM Biceps Curl",
        2,
        10,
        15,
        "small"
      ]
    ]
  },
  "4": {
    "name": "🍑 Lower B • Round Glutes + Thighs",
    "note": "Second glute session prioritizing thigh growth and side glutes. Progress leg press and hip thrust conservatively; protect Sunday run.",
    "ex": [
      [
        "EGYM Leg Press",
        3,
        10,
        15,
        "big"
      ],
      [
        "Booty Builder Hip Thrust",
        3,
        10,
        15,
        "big"
      ],
      [
        "Booty Builder Hip Abduction",
        2,
        12,
        20,
        "small"
      ],
      [
        "EGYM Leg Curl",
        2,
        10,
        15,
        "small"
      ],
      [
        "EGYM Leg Extension",
        2,
        10,
        15,
        "small"
      ],
      [
        "Ab Crunch Machine",
        2,
        10,
        15,
        "small"
      ]
    ]
  },
  "5": {
    "name": "💪 Upper B • Abs + Defined Silhouette",
    "note": "Balanced upper body and abs in the gym, with an optional 20–35 minute easy run after work. Keep gym under ~55 minutes.",
    "ex": [
      [
        "EGYM Chest Press",
        3,
        8,
        12,
        "big"
      ],
      [
        "EGYM Row",
        3,
        8,
        12,
        "big"
      ],
      [
        "Shoulder Press Machine",
        2,
        8,
        12,
        "big"
      ],
      [
        "Cable Lateral Raise",
        2,
        12,
        20,
        "small"
      ],
      [
        "Ab Crunch Machine",
        3,
        10,
        15,
        "small"
      ]
    ]
  }
};

window.PUPFIT_SWAPS = {
  "ISO-Lateral Lat Pulldown": [
    "Lat Pulldown Machine",
    "Assisted Pull-Up Machine"
  ],
  "Cable Lateral Raise": [
    "Single-Arm Cable Lateral Raise",
    "Machine Lateral Raise (if available)"
  ],
  "EGYM Chest Press": [
    "Incline Chest Press",
    "Chest Press Machine"
  ],
  "EGYM Row": [
    "Low Seated Row Machine",
    "Chest-Supported Row Machine"
  ],
  "EGYM Biceps Curl": [
    "Biceps Curl Machine",
    "Cable Biceps Curl"
  ],
  "EGYM Triceps Press": [
    "Triceps Extension Machine",
    "Cable Triceps Pushdown"
  ],
  "EGYM Leg Press": [
    "45-Degree Leg Press",
    "Horizontal Hack Squat"
  ],
  "Booty Builder Hip Thrust": [
    "Glute Kickback Machine",
    "Smith Machine Hip Thrust"
  ],
  "EGYM Leg Curl": [
    "Lying Leg Curl Machine",
    "Seated Leg Curl Machine"
  ],
  "EGYM Leg Extension": [
    "Leg Extension Machine",
    "Pendulum Squat Machine"
  ],
  "Booty Builder Hip Abduction": [
    "Hip Abduction Machine",
    "Standing Glute Kickback Machine"
  ],
  "Ab Crunch Machine": [
    "Weighted Ab Crunch Machine",
    "Cable Crunch"
  ],
  "Pec Fly / Rear-Delt Machine": [
    "Rear-Delt Machine",
    "Cable Face Pull"
  ],
  "Standing Calf Raise": [
    "Seated Calf Raise",
    "Leg Press Calf Press"
  ],
  "Incline Chest Press": [
    "EGYM Chest Press",
    "Chest Press Machine"
  ],
  "Shoulder Press Machine": [
    "Seated Shoulder Press Machine",
    "ISO-Lateral Shoulder Press"
  ],
  "Pec Deck Chest Fly": [
    "Chest Fly Machine",
    "Cable Chest Fly"
  ]
};
