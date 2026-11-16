export const SEED_THREADS = [
  {
    id: "thread-001",
    provider: "Gmail",
    accountEmail: "alex@founder.vc",
    senderName: "Sarah Jenkins",
    senderEmail: "sjenkins@horizoncap.vc",
    subject: "Series B Term Sheet Final Execution – Alex's Signature Needed by 5 PM",
    timestamps: "10 mins ago",
    isRead: false,
    isImportant: true,
    isArchived: false,
    status: "Open",
    messages: [
      {
        senderName: "Sarah Jenkins",
        senderEmail: "sjenkins@horizoncap.vc",
        timestamp: "Yesterday, 4:15 PM",
        body: "Hi Alex,\n\nOur investment committee gave final unanimous approval for the Series B $22M round. I've updated the term sheet with the 1x non-participating liquidation preference and the two founder board seat provisions we discussed.\n\nPlease review Exhibit A and confirm if you're ready for countersignature.",
        isOutgoing: false
      },
      {
        senderName: "Alex Vance",
        senderEmail: "alex@founder.vc",
        timestamp: "Yesterday, 6:30 PM",
        body: "Thanks Sarah, huge milestone. Reviewing Exhibit A with counsel tonight and will get back to you first thing.",
        isOutgoing: true
      },
      {
        senderName: "Sarah Jenkins",
        senderEmail: "sjenkins@horizoncap.vc",
        timestamp: "Today, 9:20 AM",
        body: "Good morning Alex,\n\nJust flagging that our LP capital call window closes at 5:00 PM EST today. We need your personal sign-off on the DocuSign link sent to your founder email so we can initiate wire transfers tomorrow morning.\n\nDocuSign envelope: #HZ-2026-98B\n\nBest,\nSarah",
        isOutgoing: false
      }
    ],
    aiMetadata: {
      responsibility: "Client to Reply",
      confidence: 0.98,
      segment: "Action Required",
      summary: "Horizon Capital has finalized the Series B term sheet and requires Alex's personal sign-off on board seat composition and liquidation preference before 5 PM EST today.",
      whyClientNeeded: "Requires Alex's direct legal authority as founder and final executive sign-off on valuation, board composition, and LP wire timelines.",
      extractedDates: [
        {
          title: "Series B Term Sheet Execution Deadline",
          dateTimeText: "Today by 5:00 PM EST",
          type: "Deadline"
        }
      ],
      suggestedDraft: "Hi Sarah,\n\nI have reviewed the updated terms regarding the board composition and liquidation preferences with counsel. Everything is aligned. I've just signed the DocuSign envelope (#HZ-2026-98B).\n\nThrilled to partner with Horizon Capital for this next chapter.\n\nBest,\nAlex",
      manuallyOverridden: false,
      handoffNote: ""
    }
  },
  {
    id: "thread-002",
    provider: "Outlook",
    accountEmail: "alex@enterprise.io",
    senderName: "Tim Ferriss Show Production",
    senderEmail: "producer@timferriss.com",
    subject: "Podcast Recording Rescheduling: New Recording Windows for Alex",
    timestamps: "35 mins ago",
    isRead: false,
    isImportant: false,
    isArchived: false,
    status: "Open",
    messages: [
      {
        senderName: "Tim Ferriss Show Production",
        senderEmail: "producer@timferriss.com",
        timestamp: "Today, 8:45 AM",
        body: "Hello Alex and team,\n\nTim had an unexpected travel conflict arise for this Thursday's studio recording. We are hoping to reschedule the 90-minute interview to next week.\n\nCould your team check if either of these windows works for Alex?\n1. Tuesday, Nov 24: 10:00 AM – 11:30 AM PST\n2. Wednesday, Nov 25: 2:00 PM – 3:30 PM PST\n\nWe'll provide the high-bandwidth Riverside studio link and dynamic mic guidelines once confirmed.\n\nThanks,\nKelly (Senior Producer)",
        isOutgoing: false
      }
    ],
    aiMetadata: {
      responsibility: "Assistant to Reply",
      confidence: 0.94,
      segment: "Meetings and Appointments",
      summary: "Tim Ferriss Show production team requested rescheduling Alex's 90-minute podcast recording to next Tuesday morning or Wednesday afternoon due to travel conflicts.",
      whyClientNeeded: "",
      extractedDates: [
        {
          title: "Podcast Recording Window 1",
          dateTimeText: "Tuesday, Nov 24, 10:00 AM - 11:30 AM PST",
          type: "Meeting"
        },
        {
          title: "Podcast Recording Window 2",
          dateTimeText: "Wednesday, Nov 25, 2:00 PM - 3:30 PM PST",
          type: "Meeting"
        }
      ],
      suggestedDraft: "Hi Kelly,\n\nThanks for reaching out! Checking Alex's executive calendar, Tuesday, November 24 from 10:00 AM to 11:30 AM PST works perfectly. Alex has the Shure SM7B mic ready on our end.\n\nPlease send over the Riverside studio link and prep questions.\n\nBest regards,\nElena Rostova\nExecutive Assistant to Alex Vance",
      manuallyOverridden: false,
      handoffNote: ""
    }
  },
  {
    id: "thread-003",
    provider: "Gmail",
    accountEmail: "alex@founder.vc",
    senderName: "Stripe Billing Notifications",
    senderEmail: "invoices@stripe.com",
    subject: "Monthly Billing Statement & Receipt - Invoice #INV-2026-9812 ($24,850.00)",
    timestamps: "1 hour ago",
    isRead: true,
    isImportant: false,
    isArchived: false,
    status: "Open",
    messages: [
      {
        senderName: "Stripe Billing",
        senderEmail: "invoices@stripe.com",
        timestamp: "Today, 7:30 AM",
        body: "Hello Alex,\n\nYour monthly statement for account acct_1MailPulseHQ has been successfully processed.\n\nAmount: $24,850.00 USD\nPayment Method: Silicon Valley Bank Corp Card (ending in 8841)\nStatus: Paid\n\nA full breakdown of API usage, meter fees, and subscription seats has been attached as PDF. No further action is required.",
        isOutgoing: false
      }
    ],
    aiMetadata: {
      responsibility: "No Reply Needed",
      confidence: 0.99,
      segment: "General",
      summary: "Automated payment receipt confirming monthly Stripe infrastructure fees of $24,850.00 successfully charged to the corporate card.",
      whyClientNeeded: "",
      extractedDates: [
        {
          title: "Monthly Billing Cycle Closed",
          dateTimeText: "Today, 7:30 AM",
          type: "Deadline"
        }
      ],
      suggestedDraft: "No reply required. Receipt is automatically logged to financial records.",
      manuallyOverridden: false,
      handoffNote: ""
    }
  },
  {
    id: "thread-004",
    provider: "Outlook",
    accountEmail: "alex@enterprise.io",
    senderName: "Liam Vance",
    senderEmail: "liam.vance@globaltech.com",
    subject: "Confidential exploratory synergy discussion",
    timestamps: "2 hours ago",
    isRead: false,
    isImportant: true,
    isArchived: false,
    status: "Open",
    messages: [
      {
        senderName: "Liam Vance",
        senderEmail: "liam.vance@globaltech.com",
        timestamp: "Today, 6:40 AM",
        body: "Alex,\n\nI lead Corporate Development at GlobalTech Corp. We have been tracking MailPulse's agentic workflow breakthroughs with immense admiration.\n\nOur Executive Committee is exploring whether there is mutual appetite for a confidential conversation regarding potential strategic synergies, joint product integration, or an accelerated partnership framework.\n\nAre you open to an off-the-record 20-minute Zoom with our SVP of Strategy next week?\n\nWarmly,\nLiam",
        isOutgoing: false
      }
    ],
    aiMetadata: {
      responsibility: "Needs Review",
      confidence: 0.68,
      segment: "Important",
      summary: "Inbound corporate development inquiry from GlobalTech inquiring about an off-the-record M&A or strategic integration conversation.",
      whyClientNeeded: "Ambiguous intent requires EA triage or Client decision on whether to engage in early strategic acquisition/partnership talks or politely decline.",
      extractedDates: [],
      suggestedDraft: "Hi Liam,\n\nThank you for reaching out and for your kind words on our recent releases. Could you share a high-level note on the specific integration scope GlobalTech envisions? Once we have that context, we can evaluate whether an exploratory conversation makes sense for our product roadmap.\n\nBest regards,\nAlex Vance",
      manuallyOverridden: false,
      handoffNote: ""
    }
  },
  {
    id: "thread-005",
    provider: "Gmail",
    accountEmail: "alex@founder.vc",
    senderName: "David Chen",
    senderEmail: "david.chen@cloudscale.io",
    subject: "RE: Custom Enterprise Tier Quote & GPU Reservation (#Q-8821)",
    timestamps: "3 hours ago",
    isRead: true,
    isImportant: true,
    isArchived: false,
    status: "Open",
    messages: [
      {
        senderName: "David Chen",
        senderEmail: "david.chen@cloudscale.io",
        timestamp: "Nov 14, 2:00 PM",
        body: "Alex, here is our initial proposal for the 128x H100 GPU cluster on a 1-year reserved term at $2.85/GPU-hour.",
        isOutgoing: false
      },
      {
        senderName: "Alex Vance",
        senderEmail: "alex@founder.vc",
        timestamp: "Nov 15, 11:30 AM",
        body: "Hi David, competitive benchmarks show $2.30/GPU-hour with flexible bursting. If CloudScale can match $2.35 with 99.99% uptime SLA, we are ready to sign a 2-year commitment this week.",
        isOutgoing: true
      },
      {
        senderName: "David Chen",
        senderEmail: "david.chen@cloudscale.io",
        timestamp: "Yesterday, 4:00 PM",
        body: "Thanks Alex. I've taken this directly to our VP of Infrastructure Finance for executive discounting approval. I should have a formal amended contract by tomorrow noon.",
        isOutgoing: false
      }
    ],
    aiMetadata: {
      responsibility: "Assistant to Reply",
      confidence: 0.93,
      segment: "Waiting for Response",
      summary: "Counter-offered CloudScale on 128x H100 cluster pricing at $2.35/hour; currently waiting on David Chen's finance team to approve amended contract.",
      whyClientNeeded: "",
      extractedDates: [
        {
          title: "Amended GPU Contract SLA Delivery",
          dateTimeText: "Expected tomorrow by 12:00 PM PST",
          type: "Deadline"
        }
      ],
      suggestedDraft: "Hi David,\n\nFollowing up to check if your finance team was able to sign off on the $2.35/hr amended contract. We have our architecture deployment scheduled for end of week.\n\nBest,\nAlex",
      manuallyOverridden: false,
      handoffNote: ""
    }
  },
  {
    id: "thread-006",
    provider: "Outlook",
    accountEmail: "alex@enterprise.io",
    senderName: "Marcus Brody",
    senderEmail: "mbrody@brodyventures.com",
    subject: "Urgent: Q4 Board Meeting Agenda & 2027 Budget Approval",
    timestamps: "4 hours ago",
    isRead: false,
    isImportant: true,
    isArchived: false,
    status: "Open",
    messages: [
      {
        senderName: "Marcus Brody",
        senderEmail: "mbrody@brodyventures.com",
        timestamp: "Today, 5:15 AM",
        body: "Alex,\n\nAhead of our Q4 Board Meeting on Thursday, Dec 3 at 9:00 AM EST, I reviewed the draft deck. I need your personal guidance on two points before circulating to the outside directors:\n\n1. Do we vote on the 2027 Engineering Headcount Expansion (+18 roles) before or after the live v3 product demo?\n2. Are you comfortable with maintaining the 18-month cash runway covenant?\n\nPlease confirm so my office can compile the final board packet.\n\nRegards,\nMarcus",
        isOutgoing: false
      }
    ],
    aiMetadata: {
      responsibility: "Client to Reply",
      confidence: 0.97,
      segment: "Important",
      summary: "Lead Independent Director Marcus Brody needs Alex's decision on the Q4 board agenda flow and 2027 engineering headcount budget approval.",
      whyClientNeeded: "Direct board governance decision requiring founder discretion on agenda ordering and fiduciary runway covenants.",
      extractedDates: [
        {
          title: "Q4 Board of Directors Meeting",
          dateTimeText: "Thursday, Dec 3, 2026 at 9:00 AM EST",
          type: "Meeting"
        }
      ],
      suggestedDraft: "Hi Marcus,\n\nThanks for flagging. Let's schedule the live v3 product demo first—seeing the agentic autonomous latency benchmarks will give the board the strongest context before reviewing the engineering headcount vote. Regarding the 18-month runway covenant, I am fully comfortable keeping it.\n\nPlease proceed with packaging the board packet.\n\nBest,\nAlex",
      manuallyOverridden: false,
      handoffNote: ""
    }
  },
  {
    id: "thread-007",
    provider: "Gmail",
    accountEmail: "alex@founder.vc",
    senderName: "Clara Oswald",
    senderEmail: "coswald@bloomberg.net",
    subject: "Interview Request: Bloomberg profile on AI Executive Assistants",
    timestamps: "5 hours ago",
    isRead: false,
    isImportant: false,
    isArchived: false,
    status: "Open",
    messages: [
      {
        senderName: "Clara Oswald",
        senderEmail: "coswald@bloomberg.net",
        timestamp: "Today, 4:30 AM",
        body: "Hi Alex,\n\nI'm writing a feature for Bloomberg Businessweek on how founders are deploying autonomous AI assistant pipelines to eliminate inbox triage overhead. We'd love to feature MailPulse and include quotes from you.\n\nAre you available for a 20-minute phone or Zoom interview next Wednesday afternoon? I can accommodate any time between 1:00 PM and 4:30 PM EST.\n\nCheers,\nClara Oswald\nSenior Technology Reporter, Bloomberg",
        isOutgoing: false
      }
    ],
    aiMetadata: {
      responsibility: "Assistant to Reply",
      confidence: 0.92,
      segment: "Action Required",
      summary: "Bloomberg Businessweek reporter requesting a 20-minute interview with Alex next Wednesday afternoon for a feature on autonomous executive productivity.",
      whyClientNeeded: "",
      extractedDates: [
        {
          title: "Bloomberg Press Interview Window",
          dateTimeText: "Next Wednesday, 1:00 PM - 4:30 PM EST",
          type: "Meeting"
        }
      ],
      suggestedDraft: "Hi Clara,\n\nThank you for reaching out! Alex would love to participate in the profile. Looking at Alex's schedule, Wednesday at 3:00 PM EST works great. Would you prefer a Zoom link or a direct phone call?\n\nLooking forward to coordinating,\nElena Rostova\nExecutive Assistant to Alex Vance",
      manuallyOverridden: false,
      handoffNote: ""
    }
  },
  {
    id: "thread-008",
    provider: "Outlook",
    accountEmail: "alex@enterprise.io",
    senderName: "AWS CloudWatch Alert",
    senderEmail: "no-reply@amazon.com",
    subject: "ALERT: Unusual spend detected in us-east-1 (Bedrock / GPU clusters +340%)",
    timestamps: "6 hours ago",
    isRead: false,
    isImportant: true,
    isArchived: false,
    status: "Open",
    messages: [
      {
        senderName: "AWS CloudWatch",
        senderEmail: "no-reply@amazon.com",
        timestamp: "Today, 3:15 AM",
        body: "NOTIFICATION: CloudWatch Anomaly Detection triggered for Account #4912-8821.\n\nDimension: Service: Bedrock & EC2 P5 GPU Clusters\nRegion: us-east-1\nCurrent Burn: $3,420/hour (+340% above 30-day baseline)\nEstimated Monthly Impact: +$82,000 USD\n\nPlease verify whether this is an authorized load-testing run or compromise.",
        isOutgoing: false
      }
    ],
    aiMetadata: {
      responsibility: "Needs Review",
      confidence: 0.65,
      segment: "Important",
      summary: "AWS automated monitoring detected an anomalous +340% spike in us-east-1 GPU/Bedrock cluster spend ($3,420/hr).",
      whyClientNeeded: "Requires EA verification with DevOps leads or Alex to rule out unintended cluster runaway or security incident.",
      extractedDates: [
        {
          title: "AWS CloudWatch Billing Anomaly",
          dateTimeText: "Triggered today at 3:15 AM UTC",
          type: "Deadline"
        }
      ],
      suggestedDraft: "Internal note: Alert forwarded to CTO and DevOps Lead (@marcus-dev) for urgent verification of us-east-1 training workers.",
      manuallyOverridden: false,
      handoffNote: ""
    }
  },
  {
    id: "thread-009",
    provider: "Outlook",
    accountEmail: "alex@enterprise.io",
    senderName: "Amanda Cross",
    senderEmail: "events@ritzcarlton.com",
    subject: "Executive Leadership Retreat: Banquet Menu & AV Rider Agreement",
    timestamps: "8 hours ago",
    isRead: true,
    isImportant: false,
    isArchived: false,
    status: "Open",
    messages: [
      {
        senderName: "Amanda Cross",
        senderEmail: "events@ritzcarlton.com",
        timestamp: "Yesterday, 3:00 PM",
        body: "Dear Elena and Alex,\n\nWe are preparing for the MailPulse Executive Retreat arriving on December 14 at Half Moon Bay. Attached is the banquet contract, wine selection sheet, and wireless 4K projection AV rider.\n\nPlease confirm our dietary requirements roster and sign the banquet confirmation by Friday.\n\nWarm regards,\nAmanda Cross",
        isOutgoing: false
      }
    ],
    aiMetadata: {
      responsibility: "Assistant to Reply",
      confidence: 0.96,
      segment: "Meetings and Appointments",
      summary: "Ritz-Carlton events coordinator requests confirmation of dietary restrictions and signed AV rider for the upcoming executive retreat on December 14.",
      whyClientNeeded: "",
      extractedDates: [
        {
          title: "Executive Leadership Retreat Arrival",
          dateTimeText: "Monday, December 14, 2026",
          type: "Meeting"
        },
        {
          title: "Banquet Agreement Sign-off Deadline",
          dateTimeText: "This Friday, 5:00 PM PST",
          type: "Deadline"
        }
      ],
      suggestedDraft: "Hi Amanda,\n\nI have gathered the dietary preferences for our 12 executive attendees (2 vegan, 1 gluten-free). I have signed the AV rider and attached our corporate billing authorization.\n\nThank you for ensuring everything is seamless!\n\nElena Rostova\nExecutive Assistant to Alex Vance",
      manuallyOverridden: false,
      handoffNote: ""
    }
  },
  {
    id: "thread-010",
    provider: "Gmail",
    accountEmail: "alex@founder.vc",
    senderName: "Dr. Aris Thorne",
    senderEmail: "athorne@stanford.edu",
    subject: "Offer Discussion & Equity Vesting Acceleration Terms",
    timestamps: "10 hours ago",
    isRead: false,
    isImportant: true,
    isArchived: false,
    status: "Open",
    messages: [
      {
        senderName: "Alex Vance",
        senderEmail: "alex@founder.vc",
        timestamp: "Nov 12, 10:00 AM",
        body: "Aris,\n\nWe were blown away by your vision during our lab visit. Attached is our formal offer to join MailPulse as Chief AI Scientist.",
        isOutgoing: true
      },
      {
        senderName: "Dr. Aris Thorne",
        senderEmail: "athorne@stanford.edu",
        timestamp: "Yesterday, 8:15 PM",
        body: "Dear Alex,\n\nThank you for the inspiring offer. I am genuinely eager to lead this breakthrough research.\n\nBefore executing, I wanted to discuss the 1.5% equity grant. Given my transition from tenured research, I'd like to propose a 1-year cliff followed by monthly vesting, alongside single-trigger change-of-control acceleration in the event of an acquisition. Are you open to adjusting this clause?\n\nSincerely,\nAris",
        isOutgoing: false
      }
    ],
    aiMetadata: {
      responsibility: "Client to Reply",
      confidence: 0.97,
      segment: "Action Required",
      summary: "Chief AI Scientist candidate Dr. Aris Thorne is requesting single-trigger change-of-control equity acceleration before signing his executive offer.",
      whyClientNeeded: "Key executive hire compensation negotiation requiring founder discretion and cap table dilution approval.",
      extractedDates: [
        {
          title: "Executive Offer Decision Window",
          dateTimeText: "Friday by 5:00 PM PST",
          type: "Deadline"
        }
      ],
      suggestedDraft: "Dear Aris,\n\nWe are enthusiastic about welcoming you aboard. On equity vesting, we can gladly accommodate the monthly vesting post-cliff. For acceleration, our standard across the C-suite is double-trigger (acquisition + involuntary termination within 12 months), which protects both the mission and your equity upside.\n\nLet's do a 10-minute call tomorrow morning to finalize and get this across the finish line.\n\nWarm regards,\nAlex",
      manuallyOverridden: false,
      handoffNote: ""
    }
  },
  {
    id: "thread-011",
    provider: "Gmail",
    accountEmail: "alex@founder.vc",
    senderName: "United Airlines Reservations",
    senderEmail: "reservations@united.com",
    subject: "eTicket Confirmation: SFO -> JFK (Flight UA 1408, First Class)",
    timestamps: "14 hours ago",
    isRead: true,
    isImportant: false,
    isArchived: false,
    status: "Open",
    messages: [
      {
        senderName: "United Airlines",
        senderEmail: "reservations@united.com",
        timestamp: "Yesterday, 5:45 PM",
        body: "Confirmation Code: #UAV892\nPassenger: Vance / Alexander\nFlight: UA 1408 Nonstop SFO -> JFK\nDeparture: Monday, Nov 23 at 7:30 AM PST\nSeat: 2A (United Polaris First)\nStatus: Confirmed.\n\nCheck-in opens 24 hours prior to departure.",
        isOutgoing: false
      }
    ],
    aiMetadata: {
      responsibility: "No Reply Needed",
      confidence: 0.99,
      segment: "General",
      summary: "First-class flight confirmation for Alex's trip from San Francisco (SFO) to New York (JFK) departing Monday, Nov 23 at 7:30 AM.",
      whyClientNeeded: "",
      extractedDates: [
        {
          title: "Flight UA 1408 SFO -> JFK Departure",
          dateTimeText: "Monday, Nov 23, 2026 at 7:30 AM PST",
          type: "Meeting"
        }
      ],
      suggestedDraft: "No reply needed. Travel reservation automatically added to Alex's master itinerary.",
      manuallyOverridden: false,
      handoffNote: ""
    }
  },
  {
    id: "thread-012",
    provider: "Outlook",
    accountEmail: "alex@enterprise.io",
    senderName: "Samantha Vance",
    senderEmail: "svance@cooley.com",
    subject: "Status Update: European IP Trademark Filing & WIPO Response",
    timestamps: "1 day ago",
    isRead: true,
    isImportant: true,
    isArchived: false,
    status: "Open",
    messages: [
      {
        senderName: "Samantha Vance",
        senderEmail: "svance@cooley.com",
        timestamp: "Nov 14, 11:15 AM",
        body: "Hi Alex,\n\nWe formally submitted our response to the EUIPO examiner regarding the 'MailPulse Autonomous Agent' class 42 software trademark. The opposing party has 14 business days to object or the registration will proceed to final publication.\n\nNo immediate action required on our side; we are waiting on the registrar's official gazette release.\n\nBest,\nSamantha Vance, Partner, Cooley LLP",
        isOutgoing: false
      }
    ],
    aiMetadata: {
      responsibility: "Assistant to Reply",
      confidence: 0.89,
      segment: "Waiting for Response",
      summary: "Cooley LLP filed the EU trademark response for MailPulse; currently waiting on the EUIPO registrar's 14-day publication window.",
      whyClientNeeded: "",
      extractedDates: [
        {
          title: "EUIPO Trademark Review Window",
          dateTimeText: "Expected within 14 business days",
          type: "Deadline"
        }
      ],
      suggestedDraft: "Thank you Samantha. We will keep this on our passive radar and await the registrar gazette.",
      manuallyOverridden: false,
      handoffNote: ""
    }
  },
  {
    id: "thread-013",
    provider: "Outlook",
    accountEmail: "alex@enterprise.io",
    senderName: "Delaware Division of Corporations",
    senderEmail: "noreply@state.de.us",
    subject: "Annual Franchise Tax Report Submission Confirmation - Entity #592180",
    timestamps: "1 day ago",
    isRead: true,
    isImportant: false,
    isArchived: false,
    status: "Open",
    messages: [
      {
        senderName: "State of Delaware",
        senderEmail: "noreply@state.de.us",
        timestamp: "Nov 14, 9:00 AM",
        body: "Official Electronic Confirmation:\nEntity Name: MailPulse Inc.\nFile Number: 592180\nFiling Type: 2026 Annual Franchise Tax Report\nPayment: $250.00 Received (Processed)\nGood Standing Status: ACTIVE - GOOD STANDING",
        isOutgoing: false
      }
    ],
    aiMetadata: {
      responsibility: "No Reply Needed",
      confidence: 0.99,
      segment: "General",
      summary: "State notice confirming successful submission of 2026 Delaware Annual Franchise Tax Report and Active Good Standing status.",
      whyClientNeeded: "",
      extractedDates: [
        {
          title: "Delaware Corporate Tax Filing",
          dateTimeText: "Completed Nov 14, 2026",
          type: "Deadline"
        }
      ],
      suggestedDraft: "No reply required. Confirmation archived to corporate compliance folder.",
      manuallyOverridden: false,
      handoffNote: ""
    }
  },
  {
    id: "thread-014",
    provider: "Gmail",
    accountEmail: "alex@founder.vc",
    senderName: "Robert Gallagher",
    senderEmail: "robert.gallagher@finsecure.com",
    subject: "Critical: Annual Contract Renewal & Enterprise SLA Escalation",
    timestamps: "1 day ago",
    isRead: false,
    isImportant: true,
    isArchived: false,
    status: "Open",
    messages: [
      {
        senderName: "Robert Gallagher",
        senderEmail: "robert.gallagher@finsecure.com",
        timestamp: "Nov 14, 3:30 PM",
        body: "Alex,\n\nFinSecure's $480k ARR enterprise subscription renews next Wednesday. As discussed with your account team, our compliance officer flagged two SLA breaches last month during peak trading hours.\n\nOur procurement committee will only authorize the 3-year extension if we have your personal founder commitment on isolated dedicated infrastructure and 99.99% contractual uptime.\n\nCan we speak tomorrow at 11:00 AM EST? This is a deal-breaker for our board.\n\nRobert Gallagher\nEVP Procurement, FinSecure",
        isOutgoing: false
      }
    ],
    aiMetadata: {
      responsibility: "Client to Reply",
      confidence: 0.96,
      segment: "Action Required",
      summary: "FinSecure EVP Robert Gallagher is threatening not to renew their $480k ARR contract without Alex's personal founder commitment on SLA guarantees.",
      whyClientNeeded: "Top-5 enterprise customer escalation threatening immediate contract churn without direct executive-to-executive founder reassurance.",
      extractedDates: [
        {
          title: "Contract Renewal Cut-off",
          dateTimeText: "Wednesday, Nov 25, 2026",
          type: "Deadline"
        },
        {
          title: "Executive Escalation Sync with Robert",
          dateTimeText: "Tomorrow at 11:00 AM EST",
          type: "Meeting"
        }
      ],
      suggestedDraft: "Hi Robert,\n\nI want to personally address this. FinSecure is one of our most valued partners, and the latency hiccups during the cloud migration were unacceptable. We have already provisioned dedicated isolated clusters with hardware-level redundancy for your organization, backed by our 99.99% uptime guarantee.\n\nI will gladly join tomorrow at 11:00 AM EST alongside our VP of Engineering to walk you through the architecture.\n\nTalk tomorrow,\nAlex Vance",
      manuallyOverridden: false,
      handoffNote: ""
    }
  },
  {
    id: "thread-015",
    provider: "Outlook",
    accountEmail: "alex@enterprise.io",
    senderName: "Natasha Roy",
    senderEmail: "nroy@techsummit.io",
    subject: "Invitation: Opening Keynote on AI Autonomous Agents (San Francisco)",
    timestamps: "2 days ago",
    isRead: true,
    isImportant: true,
    isArchived: false,
    status: "Open",
    messages: [
      {
        senderName: "Natasha Roy",
        senderEmail: "nroy@techsummit.io",
        timestamp: "Nov 13, 2:10 PM",
        body: "Dear Alex,\n\nOn behalf of the TechSummit 2027 Program Committee, we would be deeply honored to invite you to deliver the Opening Keynote on 'The Autonomous Executive: How Multi-Agent Systems Redefined Knowledge Work'.\n\nThe event takes place March 18, 2027 at Moscone Center, SF (3,500+ attendees). We provide full VIP travel, executive accommodations, and speaker honorarium.\n\nPlease let us know if your calendar permits by Dec 1.\n\nWarmly,\nNatasha Roy\nConference Chair",
        isOutgoing: false
      }
    ],
    aiMetadata: {
      responsibility: "Assistant to Reply",
      confidence: 0.93,
      segment: "Meetings and Appointments",
      summary: "TechSummit 2027 committee invites Alex to deliver the Opening Keynote on AI Autonomous Agents at Moscone Center on March 18, 2027.",
      whyClientNeeded: "",
      extractedDates: [
        {
          title: "TechSummit Opening Keynote",
          dateTimeText: "March 18, 2027 at Moscone Center SF",
          type: "Meeting"
        },
        {
          title: "Speaker Acceptance RSVP",
          dateTimeText: "December 1, 2026",
          type: "Deadline"
        }
      ],
      suggestedDraft: "Hi Natasha,\n\nThank you for the wonderful invitation! Alex would be thrilled to keynote TechSummit 2027. Elena here from Alex's office—could you share the technical rider and session format details? I will reserve March 18 in Alex's master calendar.\n\nBest regards,\nElena Rostova\nExecutive Assistant to Alex Vance",
      manuallyOverridden: false,
      handoffNote: ""
    }
  }
];
