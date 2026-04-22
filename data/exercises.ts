export type Level = 'beginner' | 'advanced' | 'pro';

export interface LevelConfig {
  reps: number;
  label: string;
  barWidth: string;
  color: string;
}

export const LEVELS: Record<Level, LevelConfig> = {
  beginner: { reps: 10, label: 'Beginner', barWidth: '33%', color: '#1D9E75' },
  advanced: { reps: 20, label: 'Advanced', barWidth: '66%', color: '#BA7517' },
  pro: { reps: 35, label: 'Pro', barWidth: '100%', color: '#1a1a1a' },
};

export interface Exercise {
  name: string;
  purpose: string;
  instruction: string;
  tags: string[];
  timer?: number;
  thumbnail?: number;
  gong?: boolean;
}

export interface Phase {
  id: number;
  label: string;
  title: string;
  hasReps: boolean;
  side?: 'right' | 'left';
  exercises: Exercise[];
}

export const PHASES: Phase[] = [
  {
    id: 0,
    label: 'Step 1',
    title: 'Breathwork & Kriyas',
    hasReps: false,
    exercises: [
      {
        name: 'Alternate Nostril Breathing',
        purpose: 'Balances nervous system, calms the mind',
        instruction:
          'Sit comfortably with a straight spine. Close your right nostril with your thumb and inhale through the left. Close the left nostril with your ring finger and exhale through the right. Repeat, alternating nostrils.',
        tags: ['Breathwork', 'Nervous system'],
        timer: 240,
        thumbnail: 1,
        gong: true,
      },
      {
        name: 'AUM Chanting (21 times)',
        purpose: 'Awakens inner energy, vibrational harmony',
        instruction:
          'Sit tall and chant "AUM" (Ah-uh-Mmm) deeply from the belly. Vibrate through the body 21 times. Each of the three sounds felt from pelvis to mouth/lip vibration — equal time and energy.',
        tags: ['Chanting', 'Vibration'],
        thumbnail: 2,
      },
      {
        name: 'Flutter Breath',
        purpose: 'Energizes system, clears stagnant energy',
        instruction:
          'Inhale deeply, then exhale rapidly in short bursts, fluttering the diaphragm like a butterfly.',
        tags: ['Breathwork'],
        timer: 240,
        thumbnail: 3,
        gong: true,
      },
      {
        name: 'Locks (Bandhas)',
        purpose: 'Directs prana for inner strength and focus',
        instruction:
          'Engage the root lock, abdominal lock, and throat lock while holding a deep breath in your lungs as long as you can. Release slowly. Repeat with empty lungs.',
        tags: ['Kriya', 'Energy lock'],
        thumbnail: 4,
      },
    ],
  },
  {
    id: 1,
    label: 'Step 2',
    title: 'Core Exercises',
    hasReps: true,
    exercises: [
      {
        name: 'Heart & Lung Flutter Breath Sync',
        purpose: 'Warm up heart and lungs',
        instruction:
          'Lie on your back, legs straight up with pointed toes at 90°. Lift your head/shoulders and pump your arms 10 inches off the mat while fluttering.',
        tags: ['Core', 'Warmup'],
        thumbnail: 5,
      },
      {
        name: 'Bright White Light Roll – Toes to Head Sync',
        purpose: 'Spinal flexibility and deep abs',
        instruction:
          'From lying flat, arms stretched overhead and toes pointed, take a deep breath in. On the exhale slowly roll up to sitting, reaching for your toes. Hold feet, breathe in, then slowly lay back down. Repeat.',
        tags: ['Core', 'Spinal flex'],
        thumbnail: 6,
      },
      {
        name: 'Rotation of The Moon – One foot at a time',
        purpose: 'Hip mobility and stability',
        instruction:
          'One leg flat on the mat, the other straight up 90°. Draw large controlled circles imagining bright white light. Breathe in on first circle, out on second. Continue.',
        tags: ['Hips', 'Core'],
        thumbnail: 7,
      },
      {
        name: 'Rolling Through The Cosmos & Floating in Space',
        purpose: 'Massages spine, targets hips, abs, balance',
        instruction:
          'Sit with knees bent to chest. Hug knees, balance on tailbone, roll back to shoulder blades and back up. Then V-sit: tilt back with arms extended, breathe in/out twice, twist arms left, center, right.',
        tags: ['Balance', 'Spine'],
        thumbnail: 8,
      },
      {
        name: 'Single Leg Hug – The Hug of the Earth',
        purpose: 'Endurance and coordination',
        instruction:
          'Pull one knee to your chest while the other leg hovers above the floor. Hug inward on inhale. Switch legs slowly and controlled.',
        tags: ['Core', 'Endurance'],
        thumbnail: 9,
      },
      {
        name: 'Double Leg Hug Sync – The Hug of the Stars',
        purpose: 'Total core engagement',
        instruction:
          'From flat, arms overhead, breathe in. Pull knees to chest while arms hug in. Breathe out, release to almost-flat without touching mat. Continue.',
        tags: ['Core', 'Full-body'],
        thumbnail: 10,
      },
      {
        name: 'Cutting Cords (Scissors)',
        purpose: 'Leg and core strength with a stretch',
        instruction:
          'From flat, hands cradling head. Scissor straight legs slowly then build to flutter pace. Visualize cutting a big red cord between your legs.',
        tags: ['Core', 'Legs'],
        thumbnail: 11,
      },
      {
        name: 'Double Leg Pose Sync – Holding the Mind of Bright White Light',
        purpose: 'Lower abdominal power and control',
        instruction:
          'From flat, hands cradling head. Move both legs up to 90°. Breathe out on upward movement, breathe in on the slow downward movement.',
        tags: ['Lower abs'],
        thumbnail: 12,
      },
      {
        name: 'Wheel of Energy – Bicycling Sit Up',
        purpose: 'Oblique strength and spinal rotation',
        instruction:
          'Bring opposite elbow to opposite knee, rotating through the ribs. Alternate sides.',
        tags: ['Obliques'],
        thumbnail: 13,
      },
      {
        name: 'Spine Stretch Forward – The Cobra Stretch',
        purpose: 'Decompresses the vertebrae',
        instruction:
          'Roll onto stomach, hands at shoulders. Lift upper body as high as you can. Breathe, then turn head to left as far as possible, breathe, return center, then to right as far as possible.',
        tags: ['Spine', 'Back'],
        thumbnail: 14,
      },
    ],
  },
  {
    id: 2,
    label: 'Step 3 — Right',
    title: 'Side Exercises',
    hasReps: true,
    side: 'right',
    exercises: [
      {
        name: 'Bent Leg Lift – Parallel Energy',
        purpose: 'Side hip strengthening',
        instruction:
          'Lie on your right side, both legs bent 45°. Lift the top leg up and down creating magnetic tension — no touching knees together.',
        tags: ['Hips', 'Side body'],
        thumbnail: 15,
      },
      {
        name: 'Bent Leg Lift Foot Up – Heel to Cosmos Release',
        purpose: 'Ankle and hip engagement',
        instruction: 'Same as above but flex the top foot upward during lift, heel out.',
        tags: ['Hips', 'Ankles'],
        thumbnail: 16,
      },
      {
        name: 'Clams – Pelvis Release',
        purpose: 'Glute medius activation',
        instruction:
          'On your side, legs bent 45°, feet together. Open the top knee like a clamshell. Hold open, then close slowly on inhale.',
        tags: ['Glutes', 'Hips'],
        thumbnail: 17,
      },
      {
        name: 'Elevated Clams – Floating Pelvis Release',
        purpose: 'Increases intensity for hips and core',
        instruction: 'Same as Clams but lift both feet off the mat while performing. Keep feet in the air.',
        tags: ['Glutes', 'Core'],
        thumbnail: 18,
      },
      {
        name: 'Elevated Clams Kick – Floating Pelvis Pose Kick',
        purpose: 'Dynamic movement for strength',
        instruction:
          'From elevated clams, extend the top leg out in a kick with a pointed toe. Bring toe back on inhale.',
        tags: ['Hips', 'Dynamic'],
        thumbnail: 19,
      },
      {
        name: 'Toe Tap – Soil to Sky',
        purpose: 'Hip flexor and stabilizer work',
        instruction:
          'Both legs straight, body slightly bent at waist, legs inward at 20°. Top leg extended — tap toes forward 10x, then backwards 10x.',
        tags: ['Hip flexors'],
        thumbnail: 20,
      },
      {
        name: 'Big Side Circles – Waves of the Ocean',
        purpose: 'Full hip range of motion',
        instruction:
          'Lift top leg and draw large circles forward. Breathe in on one rotation, out on next. Repeat 10x then reverse direction.',
        tags: ['Hip mobility'],
        thumbnail: 21,
      },
      {
        name: 'Small Side Circles – Waves of the Sea',
        purpose: 'Precision and endurance in hips',
        instruction: 'Same as big circles but smaller, controlled, with rapid breathing.',
        tags: ['Endurance'],
        thumbnail: 22,
      },
      {
        name: 'Leg Lifts – Magnetic Poles',
        purpose: 'Outer thigh and hip toning',
        instruction:
          'Top leg up to shoulder height. Create magnetic tension — slowly up and down without legs touching. Breathe out on every upward lift.',
        tags: ['Outer thigh'],
        thumbnail: 23,
      },
      {
        name: 'Hug of The Moon – stretch',
        purpose: 'Releases tension in sides and hips',
        instruction: 'Cross top leg over bottom, twist torso for a deep side stretch. Hold and breathe.',
        tags: ['Stretch'],
        thumbnail: 24,
      },
    ],
  },
  {
    id: 3,
    label: 'Step 3 — Left',
    title: 'Side Exercises',
    hasReps: true,
    side: 'left',
    exercises: [
      {
        name: 'Bent Leg Lift – Parallel Energy',
        purpose: 'Side hip strengthening',
        instruction:
          'Switch to your LEFT side. Both legs bent 45°. Lift the top leg up and down creating magnetic tension.',
        tags: ['Hips', 'Side body'],
        thumbnail: 15,
      },
      {
        name: 'Bent Leg Lift Foot Up – Heel to Cosmos Release',
        purpose: 'Ankle and hip engagement',
        instruction: 'Same as above but flex the top foot upward during lift, heel out.',
        tags: ['Hips', 'Ankles'],
        thumbnail: 16,
      },
      {
        name: 'Clams – Pelvis Release',
        purpose: 'Glute medius activation',
        instruction:
          'On your left side, legs bent 45°, feet together. Open the top knee like a clamshell. Hold, then close slowly on inhale.',
        tags: ['Glutes', 'Hips'],
        thumbnail: 17,
      },
      {
        name: 'Elevated Clams – Floating Pelvis Release',
        purpose: 'Increases intensity for hips and core',
        instruction: 'Same as Clams but lift both feet off the mat throughout.',
        tags: ['Glutes', 'Core'],
        thumbnail: 18,
      },
      {
        name: 'Elevated Clams Kick – Floating Pelvis Pose Kick',
        purpose: 'Dynamic movement for strength',
        instruction:
          'From elevated clams, extend the top leg in a kick with pointed toe. Bring toe back on inhale.',
        tags: ['Hips', 'Dynamic'],
        thumbnail: 19,
      },
      {
        name: 'Toe Tap – Soil to Sky',
        purpose: 'Hip flexor and stabilizer work',
        instruction:
          'Both legs straight, body slightly bent at waist, legs inward 20°. Tap toes forward 10x, then backwards 10x.',
        tags: ['Hip flexors'],
        thumbnail: 20,
      },
      {
        name: 'Big Side Circles – Waves of the Ocean',
        purpose: 'Full hip range of motion',
        instruction:
          'Lift top leg, draw large circles forward. Breathe in one rotation, out next. 10x then reverse.',
        tags: ['Hip mobility'],
        thumbnail: 21,
      },
      {
        name: 'Small Side Circles – Waves of the Sea',
        purpose: 'Precision and endurance in hips',
        instruction: 'Smaller, controlled circles with rapid breathing.',
        tags: ['Endurance'],
        thumbnail: 22,
      },
      {
        name: 'Leg Lifts – Magnetic Poles',
        purpose: 'Outer thigh and hip toning',
        instruction:
          'Top leg to shoulder height. Magnetic tension, slowly up and down. Breathe out on every up lift.',
        tags: ['Outer thigh'],
        thumbnail: 23,
      },
      {
        name: 'Hug of The Moon – stretch',
        purpose: 'Releases tension in sides and hips',
        instruction: 'Cross top leg over bottom, twist torso for deep side stretch. Hold and breathe.',
        tags: ['Stretch'],
        thumbnail: 24,
      },
    ],
  },
  {
    id: 4,
    label: 'Step 4',
    title: 'Standing Stretches',
    hasReps: false,
    exercises: [
      {
        name: 'Earth Tilt 23.44°',
        purpose: 'Lateral body stretch',
        instruction:
          'Stand tall, reach both arms overhead and tilt 23.4° to the side. Hold and breathe. Repeat each side 3 times.',
        tags: ['Side body', 'Standing'],
        thumbnail: 25,
      },
      {
        name: 'Stirring the Core of The Universe',
        purpose: 'Hamstring and back release',
        instruction:
          'Bend forward from hips, let arms hang. Left arm then right arm, opposite arm on ankle. Move only the arm — do not bounce or move head, neck, or torso. Breathe in on one full rotation, out on next.',
        tags: ['Hamstrings', 'Back'],
        thumbnail: 26,
      },
      {
        name: 'Toes to Head – Bright White Light Energy Lock',
        purpose: 'Full posterior chain stretch',
        instruction: 'Stand and reach down to touch toes, bending knees if needed.',
        tags: ['Stretch'],
        thumbnail: 27,
      },
    ],
  },
  {
    id: 5,
    label: 'Step 5',
    title: 'Meditation',
    hasReps: false,
    exercises: [
      {
        name: 'Closing Breathwork & Meditation',
        purpose: 'Restore calm, seal energy, enhance recovery',
        instruction:
          'Return to seated. Inhale 4 counts and exhale 6 while focusing on a candle flame. Slowly lift your head to squint at flame. Close eyes gently until you enter meditation emptiness. No counting — just breathe.',
        tags: ['Meditation', 'Closing'],
        timer: 300,
        thumbnail: 28,
        gong: true,
      },
    ],
  },
];
