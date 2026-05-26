// 15 Predefined Mock Tests for CareerCracker AI
// These represent blueprints. The main seeder script will link them with actual questions.

const mockTests = [
  {
    title: 'TCS Ninja National Qualifier Test (NQT) - Mock 1',
    description: 'Full-length mock test matching the latest TCS Ninja recruitment pattern including Numerical Ability, Verbal Ability, and Reasoning Ability.',
    category: 'mixed',
    company: 'TCS',
    duration: 30, // minutes
    totalMarks: 100,
    passingMarks: 50,
    difficulty: 'mixed',
    tags: ['TCS', 'Ninja', 'NQT', 'Quantitative', 'Logical', 'Verbal'],
    blueprint: {
      quantitative: 5,
      logical: 5,
      verbal: 5
    }
  },
  {
    title: 'Infosys System Engineer (SE) recruitment - Mock 1',
    description: 'Comprehensive mock test designed for Infosys SE hiring, focusing on Mathematical Ability, Logical Reasoning, and Verbal English.',
    category: 'mixed',
    company: 'Infosys',
    duration: 40,
    totalMarks: 120,
    passingMarks: 60,
    difficulty: 'mixed',
    tags: ['Infosys', 'SE', 'Quantitative', 'Logical', 'Verbal'],
    blueprint: {
      quantitative: 6,
      logical: 6,
      verbal: 4
    }
  },
  {
    title: 'Cognizant GenC Diagnostic Test',
    description: 'Mock test for Cognizant GenC placement, focusing on basic quantitative skills, analytical reasoning, and communication skills.',
    category: 'mixed',
    company: 'Cognizant',
    duration: 30,
    totalMarks: 90,
    passingMarks: 45,
    difficulty: 'easy',
    tags: ['Cognizant', 'GenC', 'Quantitative', 'Logical', 'Verbal'],
    blueprint: {
      quantitative: 4,
      logical: 4,
      verbal: 4
    }
  },
  {
    title: 'Wipro Elite NLTH Placement Mock',
    description: 'Full exam simulation matching the Wipro Elite National Level Talent Hunt (NLTH) pattern containing Aptitude and English.',
    category: 'mixed',
    company: 'Wipro',
    duration: 35,
    totalMarks: 100,
    passingMarks: 50,
    difficulty: 'mixed',
    tags: ['Wipro', 'Elite', 'NLTH', 'Quantitative', 'Logical', 'Verbal'],
    blueprint: {
      quantitative: 5,
      logical: 5,
      verbal: 5
    }
  },
  {
    title: 'Accenture ASE Placement Qualifier',
    description: 'Mock exam matching the Accenture Associate Software Engineer cognitive assessment including English Ability, Critical Reasoning, and Problem Solving.',
    category: 'mixed',
    company: 'Accenture',
    duration: 45,
    totalMarks: 100,
    passingMarks: 55,
    difficulty: 'mixed',
    tags: ['Accenture', 'ASE', 'Logical', 'Verbal', 'Quantitative'],
    blueprint: {
      quantitative: 4,
      logical: 6,
      verbal: 5
    }
  },
  {
    title: 'Capgemini Excellence Cognitive Assessment',
    description: 'Specially designed mock test matching Capgemini\'s recruitment process focusing on Game-based Aptitude patterns, English, and Logical Puzzles.',
    category: 'mixed',
    company: 'Capgemini',
    duration: 30,
    totalMarks: 80,
    passingMarks: 40,
    difficulty: 'mixed',
    tags: ['Capgemini', 'Logical', 'Quantitative', 'Verbal'],
    blueprint: {
      quantitative: 4,
      logical: 6,
      verbal: 4
    }
  },
  {
    title: 'HCL Tech Placement Mock Assessment',
    description: 'Standard placement preparation mock test for HCL Technologies graduate hiring programs.',
    category: 'mixed',
    company: 'HCL',
    duration: 30,
    totalMarks: 100,
    passingMarks: 50,
    difficulty: 'easy',
    tags: ['HCL', 'Quantitative', 'Logical', 'Verbal'],
    blueprint: {
      quantitative: 5,
      logical: 5,
      verbal: 5
    }
  },
  {
    title: 'Quantitative Aptitude Mega Mock Test',
    description: 'In-depth evaluation of your Quantitative abilities covering Number Systems, Profit & Loss, Time & Work, Speed Distance, and Ratios.',
    category: 'quantitative',
    company: 'None',
    duration: 45,
    totalMarks: 150,
    passingMarks: 75,
    difficulty: 'hard',
    tags: ['Quantitative', 'Arithmetic', 'Number-Systems', 'Profit-Loss'],
    blueprint: {
      quantitative: 15,
      logical: 0,
      verbal: 0
    }
  },
  {
    title: 'Logical Reasoning Speed Challenge',
    description: 'Time-bound speed assessment testing analytical puzzles, blood relations, syllogisms, coding-decoding, and series completion.',
    category: 'logical',
    company: 'None',
    duration: 20,
    totalMarks: 60,
    passingMarks: 30,
    difficulty: 'medium',
    tags: ['Logical', 'Reasoning', 'Analytical', 'Puzzles'],
    blueprint: {
      quantitative: 0,
      logical: 10,
      verbal: 0
    }
  },
  {
    title: 'Verbal Ability and Grammar Booster',
    description: 'A dedicated test to boost confidence in verbal reasoning, sentence correction, reading comprehension, and vocabulary.',
    category: 'verbal',
    company: 'None',
    duration: 20,
    totalMarks: 50,
    passingMarks: 25,
    difficulty: 'easy',
    tags: ['Verbal', 'English', 'Grammar', 'Comprehension'],
    blueprint: {
      quantitative: 0,
      logical: 0,
      verbal: 10
    }
  },
  {
    title: 'TCS Digital Advanced Mock Assessment',
    description: 'High-difficulty mock test representing the TCS Digital (Advanced NQT) path. Includes advanced arithmetic, complex logic, and higher-order reasoning.',
    category: 'mixed',
    company: 'TCS',
    duration: 60,
    totalMarks: 200,
    passingMarks: 110,
    difficulty: 'hard',
    tags: ['TCS', 'Digital', 'Advanced', 'Quantitative', 'Logical'],
    blueprint: {
      quantitative: 10,
      logical: 10,
      verbal: 5
    }
  },
  {
    title: 'Infosys Specialist Programmer (SP) Mock',
    description: 'Advanced mock exam geared toward the Infosys Specialist Programmer and Digital Specialist Engineer assessment patterns.',
    category: 'mixed',
    company: 'Infosys',
    duration: 60,
    totalMarks: 200,
    passingMarks: 100,
    difficulty: 'hard',
    tags: ['Infosys', 'SP', 'DSE', 'Advanced', 'Logical'],
    blueprint: {
      quantitative: 8,
      logical: 12,
      verbal: 5
    }
  },
  {
    title: 'Accenture Advanced Cognitive Challenge',
    description: 'A challenging assessment representing Accenture\'s high-tier profile selection tests, featuring critical thinking and numerical skills.',
    category: 'mixed',
    company: 'Accenture',
    duration: 40,
    totalMarks: 120,
    passingMarks: 70,
    difficulty: 'hard',
    tags: ['Accenture', 'Advanced', 'Cognitive', 'Logical'],
    blueprint: {
      quantitative: 6,
      logical: 10,
      verbal: 4
    }
  },
  {
    title: 'Cognizant GenC Pro Advanced Assessment',
    description: 'Mock test for Cognizant GenC Pro profile. Offers a mixture of medium to hard difficulty quantitative and reasoning challenges.',
    category: 'mixed',
    company: 'Cognizant',
    duration: 30,
    totalMarks: 100,
    passingMarks: 60,
    difficulty: 'medium',
    tags: ['Cognizant', 'GenC Pro', 'Quantitative', 'Logical'],
    blueprint: {
      quantitative: 7,
      logical: 8,
      verbal: 5
    }
  },
  {
    title: 'Wipro Turbo Speed Mock',
    description: 'Accelerated test pattern mirroring the Wipro Turbo profile selection, testing numerical agility and analytical skills.',
    category: 'mixed',
    company: 'Wipro',
    duration: 45,
    totalMarks: 150,
    passingMarks: 80,
    difficulty: 'medium',
    tags: ['Wipro', 'Turbo', 'Quantitative', 'Logical', 'Verbal'],
    blueprint: {
      quantitative: 8,
      logical: 8,
      verbal: 4
    }
  }
];

module.exports = mockTests;
