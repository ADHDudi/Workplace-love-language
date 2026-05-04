export type OptionId = 'A' | 'B' | 'C' | 'D' | 'E';

export interface Option {
  id: OptionId;
  text: string;
}

export interface Question {
  id: number;
  text: string;
  options: Option[];
}

export interface Playbook {
  crunchTime: string;
  burnoutSigns: string;
  negativeFeedback: string;
}

export interface ResultType {
  id: OptionId;
  title: string;
  subtitle: string;
  meaning: string;
  insights: string;
  tips: string[];
  userManualTemplate: string;
  playbook: Playbook;
}

export const questions: Question[] = [
  {
    id: 1,
    text: "It’s your first week of work in a new job. What gesture would mean the most to you?",
    options: [
      { id: 'A', text: "Your coworker, who was promoted from your position, shares some tips and advice for getting started." },
      { id: 'B', text: "Your boss arranges lunch for you and your team, so everyone can get to know each other." },
      { id: 'C', text: "You’re immediately granted access to some of the most exciting projects the senior team members are working on." },
      { id: 'D', text: "A coworker volunteers to walk you through some of the processes that can seem unfamiliar or confusing." },
      { id: 'E', text: "Your boss schedules a series of meetings over the next 3 months to check in on your progress and to clear up any confusing aspects of your new job." },
    ]
  },
  {
    id: 2,
    text: "You’ve outperformed your goals this year, and you’re looking forward to recognition at work. What type of recognition from your boss would mean the most?",
    options: [
      { id: 'A', text: "A simple congratulatory email and/or a shoutout in the next all-team meeting." },
      { id: 'B', text: "A team outing to celebrate everyone’s varied accomplishments." },
      { id: 'C', text: "A meeting where your boss presents new opportunities that will strengthen your skills and broaden your experience." },
      { id: 'D', text: "A hearty congratulatory email that also details your potential path upward at the organization." },
      { id: 'E', text: "A high-five and a big smile from your boss." },
    ]
  },
  {
    id: 3,
    text: "Your favorite coworker is having a particularly tough week, and they seem like they just can’t catch a break. What do you do?",
    options: [
      { id: 'A', text: "Send an email with advice on how you handled a similar problem in the past." },
      { id: 'B', text: "Invite your coworker on a lunch walk to vent and take a quick break." },
      { id: 'C', text: "Offer an encouraging “pat on the back” from your experience. This, too, shall pass." },
      { id: 'D', text: "Offer to take a specific piece of work off their plate this week." },
      { id: 'E', text: "Bring your coworker an afternoon coffee to help them get through the rest of the day." },
    ]
  },
  {
    id: 4,
    text: "Your company has recently laid off many employees, including you. What would be the most encouraging thing to hear from management after a layoff?",
    options: [
      { id: 'A', text: "Receive a personal email that offers appreciation for your work and an offer to keep in touch to work toward a new path forward for you." },
      { id: 'B', text: "Receive an invite to a dinner with your boss and other laid-off employees." },
      { id: 'C', text: "Receive an email with open job listings that your soon-to-be former boss thinks you’d be the perfect candidate for." },
      { id: 'D', text: "Receive flattering introductory emails to other professionals who might be able to help you explore new opportunities." },
      { id: 'E', text: "Receive a LinkedIn endorsement detailing your contributions to the company." },
    ]
  },
  {
    id: 5,
    text: "You’ve recently completed a lengthy interview process, and you’ve just been informed that your salary expectations are a bit higher than the company can match. What would be the ideal path forward for you?",
    options: [
      { id: 'A', text: "The interviewer suggests another position that aligns with your salary expectations and skill sets." },
      { id: 'B', text: "The interviewer/recruiter expresses that they would love to keep in touch with you in the case that other opportunities arise—whether with this organization or another one." },
      { id: 'C', text: "A compensation package that promises a performance-based review after three months or another specified amount of time." },
      { id: 'D', text: "The hiring manager details specific steps you can take to enhance your skills and experience in order to increase your earning potential." },
      { id: 'E', text: "The interviewer expresses their regrets, but sends a thoughtful email about what they absolutely loved about you in the interview process, as well as the areas in which you can improve." },
    ]
  },
  {
    id: 6,
    text: "You’re a manager, your team had a great year, and you want to celebrate. What is most appealing to you?",
    options: [
      { id: 'A', text: "Make sure to publicly let your bosses know about all of the hard work your team has put in to outperform expectations." },
      { id: 'B', text: "A day off for everyone to recuperate." },
      { id: 'C', text: "A plan to build off the success, with new and exciting opportunities for everyone." },
      { id: 'D', text: "Personalized notes to everyone on the team, which communicate your understanding of how hard they worked and what you envision for their future." },
      { id: 'E', text: "A public, heartfelt congratulations that mentions each team member’s individual contribution to success." },
    ]
  },
  {
    id: 7,
    text: "You’re having a tough time keeping up with your workload, and you want to have a proactive discussion with your boss about it. What do you suggest as a resolution?",
    options: [
      { id: 'A', text: "Increased support from management, especially regarding the division of labor." },
      { id: 'B', text: "Relief from a burnout-level amount of work." },
      { id: 'C', text: "A bonus structure that reflects the extra work you’ve been doing." },
      { id: 'D', text: "More support or assistance in your workload, which is unmanageable for one person." },
      { id: 'E', text: "Communication of plans for the company’s future, especially when it comes to managing high-stress workloads." },
    ]
  },
  {
    id: 8,
    text: "A new manager is joining to lead your team. What is the best first impression they can make on you?",
    options: [
      { id: 'A', text: "A scheduled 1:1 dedicated to sharing your work styles and planning how to work together." },
      { id: 'B', text: "An all-team happy hour, where everyone gets to know one another." },
      { id: 'C', text: "A goals-based discussion with your new boss to get them up to speed with what you’ve been working on and what you’d like to achieve in the coming year." },
      { id: 'D', text: "An opportunity to share what “works” in your organization, what can be improved upon, and any potential problems that repeatedly stall progress." },
      { id: 'E', text: "An inspiring speech about their experience, their excitement, their specific plans for the future, and how they hope to involve the team in future success." },
    ]
  },
  {
    id: 9,
    text: "What is the most appealing slice of “company culture” to you?",
    options: [
      { id: 'A', text: "Weekly 1:1s with your boss" },
      { id: 'B', text: "Team outings that allow you to bond with your coworkers off the clock." },
      { id: 'C', text: "Management recognition and equal opportunities for workers who demonstrate real growth or potential." },
      { id: 'D', text: "An open-door policy where team members can feel empowered to ask for help and support without fear." },
      { id: 'E', text: "Simple recognition, gratitude, and respect for everyone’s lives outside of work, too." },
    ]
  }
];

export const results: Record<OptionId, ResultType> = {
  A: {
    id: 'A',
    title: "Words of Affirmation",
    subtitle: "Feedback + Mentorship",
    meaning: "Feedback is what propels you to do better. If you have aspirations of leadership, let your manager know that you are open to learning new ways to do things to strengthen your own managerial skill sets.",
    insights: "In a tech environment (PMs, Managers), you thrive when communication is clear, constructive, and appreciative. You define success not just by shipping products, but by the qualitative validation of your approach and strategies.",
    tips: [
      "Ask your manager for regular, constructive feedback during 1:1s.",
      "As a PM, foster a culture of positive reinforcement during sprint retrospectives.",
      "Acknowledge the specific contributions of engineers and designers out loud in stand-ups."
    ],
    userManualTemplate: "Hi team! 👋 I recently took a 'Workplace Love Language' assessment and discovered my primary style is Words of Affirmation (Feedback + Mentorship). 💬\n\nAt work, I thrive when communication is clear, constructive, and appreciative. I value qualitative validation and feel most motivated when I receive regular, constructive feedback during 1:1s or when specific contributions are acknowledged in syncs.\n\nI'm always open to feedback to improve my skills and help our team succeed!",
    playbook: {
      crunchTime: "I need clear, explicit validation that my focus and prioritization are correct. A quick 'Great call prioritizing X over Y' keeps me grounded.",
      burnoutSigns: "I become unusually quiet, stop offering encouragement to others, and hyper-fixate on minor criticisms or missing feedback.",
      negativeFeedback: "Frame it clearly but kindly, sandwiched with genuine appreciation for my effort so I don't feel entirely invalidated."
    }
  },
  B: {
    id: 'B',
    title: "Quality Time",
    subtitle: "Workplace Bonding",
    meaning: "In the workplace, this falls into the “non-work” category. This is taking time for non-work-related 1:1 meetings. This is following up with your coworker about their new puppy. This is taking the time for the personal.",
    insights: "Tech projects can be incredibly isolating, even in agile teams. You are the glue that holds cross-functional teams together. You value psychological safety born out of genuine personal connections over purely transactional interactions.",
    tips: [
      "Schedule virtual or in-person coffee chats not focused on project status.",
      "For Managers: dedicate the first 5 minutes of your syncs to human connection.",
      "Create spaces (like Slack channels) dedicated to non-work interests to build camaraderie."
    ],
    userManualTemplate: "Hi team! 👋 I recently took a 'Workplace Love Language' assessment and discovered my primary style is Quality Time (Workplace Bonding). ☕\n\nI deeply value psychological safety and genuine personal connections with my teammates. While I'm dedicated to our projects, I feel most supported when we take a few minutes to connect on a human level during 1:1s or informal coffee chats, rather than purely transactional interactions.\n\nLooking forward to building great things together!",
    playbook: {
      crunchTime: "I prefer syncs over endless Slack threads. A quick 10-minute huddle to align visually/verbally reduces my anxiety immensely.",
      burnoutSigns: "I isolate myself, cancel coffee chats, skip team lunches, and keep interactions strictly transactional.",
      negativeFeedback: "Give it to me in private during a 1:1, focusing on our partnership and how we can solve it together, rather than throwing me a cold Slack message."
    }
  },
  C: {
    id: 'C',
    title: "Receiving Gifts",
    subtitle: "New Opportunities + Challenges",
    meaning: "When this is your love language, you work hard to ensure you’re at the top of the list to be on a new project or take on a new opportunity. To communicate this love language, keep an open line with your management. When an opportunity arises, make sure to raise your hand.",
    insights: "For you, trust is demonstrated through investment in your growth. In a tech org, your 'gifts' are high-visibility projects, access to new tools, or sponsorship to attend a major conference. You are driven by intellectual challenges.",
    tips: [
      "Voice your ambition explicitly to product leadership; make your desired career path known.",
      "Managers should reward top performers by delegating high-impact, strategic work, not just more volume.",
      "Frame team successes around the new capabilities and opportunities they unlock for the division."
    ],
    userManualTemplate: "Hi team! 👋 I recently took a 'Workplace Love Language' assessment and discovered my primary style is Receiving Gifts (New Opportunities + Challenges). 🎁\n\nIn our tech environment, my 'gifts' are high-visibility projects, access to new tools, or opportunities to learn new skills. I'm highly motivated by intellectual challenges, and trust is demonstrated to me through investment in my professional growth.\n\nPlease feel free to send new opportunities and strategic challenges my way!",
    playbook: {
      crunchTime: "Let me own a specific, high-stakes piece of the puzzle. Give me end-to-end responsibility and the autonomy to deliver it.",
      burnoutSigns: "I stop volunteering for new challenges, express boredom, and seem disengaged during strategic planning sessions.",
      negativeFeedback: "Frame it as an area of growth or a new challenge to master. Show me how improving this connects to my long-term career goals."
    }
  },
  D: {
    id: 'D',
    title: "Acts of Service",
    subtitle: "Support",
    meaning: "This language is for someone who really believes that actions speak louder than words. Support, in the workplace, might look like checking in with someone who is struggling or over-worked. Unlike some other love languages, support includes action.",
    insights: "In the fast-paced world of tech and product management, you value teammates who roll up their sleeves. Removing blockers, taking over a tedious Jira grooming session, or jumping in to help QA a feature speaks volumes to you.",
    tips: [
      "When a PM or Engineer is overwhelmed, step in and take a specific, actionable task off their plate.",
      "Managers: actively seek to remove bureaucratic hurdles and streamline processes for your team.",
      "Show appreciation by honoring team members' time—be prepared for meetings and communicate clearly."
    ],
    userManualTemplate: "Hi team! 👋 I recently took a 'Workplace Love Language' assessment and discovered my primary style is Acts of Service (Support). 🤝\n\nFor me, actions speak louder than words. I deeply appreciate when teammates roll up their sleeves to help remove blockers, assist with tedious tasks, or streamline our processes.\n\nI also try to offer the same support! So if you're feeling overwhelmed, let me know how I can take a specific, actionable task off your plate!",
    playbook: {
      crunchTime: "Don't just ask 'how to help'—jump in and take a specific, well-defined task off my board, like cleaning up Jira or writing release notes.",
      burnoutSigns: "I become a bottleneck, refuse to delegate, complain about processes, and try to do everything myself until exhaustion.",
      negativeFeedback: "Pair the feedback with actionable steps we can take together to improve the process or system backing the issue."
    }
  },
  E: {
    id: 'E',
    title: "Physical Touch",
    subtitle: "Encouraging Touchpoints",
    meaning: "For the workplace, we replaced physical touch with encouragement. Think of the phone call or the email you received when you got the job. Encouragement can be touchpoints or compliments regularly infused into the workweek.",
    insights: "You are energized by momentum, shared excitement, and visible camaraderie. While literal physical touch isn't the focus, high-fives (virtual or literal), celebratory emojis, and high-energy affirmations keep you engaged and valued.",
    tips: [
      "Celebrate small wins visually—use emojis, gifs, and celebratory messages in team chats.",
      "Managers: check in frequently with brief, positive touchpoints rather than waiting for formal reviews.",
      "Organize quick celebration rituals when a project milestone is met or a feature is shipped."
    ],
    userManualTemplate: "Hi team! 👋 I recently took a 'Workplace Love Language' assessment and discovered my primary style is Encouraging Touchpoints. ✨\n\nI am energized by momentum, shared excitement, and visible camaraderie. While I love diving deep into work, celebratory messages, visual wins, and high-energy affirmations keep me highly engaged and motivated.\n\nLet's make sure we frequently celebrate our milestones, big and small!",
    playbook: {
      crunchTime: "I need momentum! High-fives, quick emojis, and shared celebrations of small micro-wins keep my energy high during long hours.",
      burnoutSigns: "I lose my typical enthusiasm, stop reacting with emojis, and seem physically depleted or distant during team meetings.",
      negativeFeedback: "Deliver it with warmth and reassurance that I am still a valued member of the team. A friendly tone goes a long way."
    }
  }
};
