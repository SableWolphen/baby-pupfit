// Baby PupFit: balanced machine-only physique split. Four priority lifting days; Wednesday optional; Thursday legs; Sunday easy run.
// Focus: defined chest/shoulders and abs plus fuller glutes/thighs. No aggressive daily volume.
window.PUPFIT_PLANS = {
  "1": {
    "name": "🪽 Upper A • Chest + Shoulders + Abs",
    "note": "Chest and shoulder definition plus a balanced back. Keep 2–3 clean reps in reserve; weighted abs finish the session.",
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
        3,
        12,
        20,
        "small"
      ],
      [
        "EGYM Chest Press",
        2,
        8,
        12,
        "big"
      ],
      [
        "EGYM Row",
        2,
        8,
        12,
        "big"
      ],
      [
        "EGYM Triceps Press",
        2,
        10,
        15,
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
  },
  "2": {
    "name": "🍑 Lower A • Glutes + Thighs + Abs",
    "note": "Hip thrusts lead; build glutes and legs with controlled reps. Leave 2–3 reps in reserve and progress loads gradually.",
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
        "EGYM Leg Curl",
        3,
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
        "Booty Builder Hip Abduction",
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
  },
  "3": {
    "name": "✨ OPTIONAL • Easy Upper Detail",
    "note": "Light pump only when recovered: rear-delt mode on the combo machine, curls and gentle shoulder/calf work. Skip it if sore or low on energy; no hard intervals before Thursday legs.",
    "ex": [
      [
        "Pec Fly / Rear-Delt Machine",
        2,
        12,
        20,
        "small"
      ],
      [
        "Cable Lateral Raise",
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
      ],
      [
        "Standing Calf Raise",
        2,
        10,
        15,
        "small"
      ]
    ]
  },
  "4": {
    "name": "🍑 Lower B • Glute Shape + Abs",
    "note": "Your protected Thursday leg day: hip thrust, leg press, curls/extensions, abduction and abs. Friday and Saturday recover legs before Sunday's easy run.",
    "ex": [
      [
        "Booty Builder Hip Thrust",
        3,
        10,
        15,
        "big"
      ],
      [
        "EGYM Leg Press",
        3,
        10,
        15,
        "big"
      ],
      [
        "EGYM Leg Curl",
        3,
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
        "Booty Builder Hip Abduction",
        3,
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
  },
  "5": {
    "name": "💪 Upper B • Chest + Shoulder Detail",
    "note": "Second upper day: chest press, shoulder press, side delts and a chest-fly setting on the pec-deck. Back and arms round out the athletic look, with no leg fatigue before Sunday.",
    "ex": [
      [
        "EGYM Chest Press",
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
        3,
        12,
        20,
        "small"
      ],
      [
        "Pec Deck Chest Fly",
        2,
        12,
        20,
        "small"
      ],
      [
        "ISO-Lateral Lat Pulldown",
        2,
        8,
        12,
        "big"
      ],
      [
        "EGYM Row",
        2,
        8,
        12,
        "big"
      ],
      [
        "EGYM Biceps Curl",
        2,
        10,
        15,
        "small"
      ],
      [
        "EGYM Triceps Press",
        2,
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
