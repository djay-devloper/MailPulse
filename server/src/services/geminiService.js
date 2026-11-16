import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini client if API key is present
const getGeminiModel = (customApiKey = null) => {
  const apiKey = customApiKey || process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    return genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  } catch (err) {
    console.warn('Failed to initialize GoogleGenerativeAI model:', err.message);
    return null;
  }
};

/**
 * Intelligent Fallback Triage Rule Engine
 * Used if GEMINI_API_KEY is not configured or network call fails
 */
function heuristicTriage({ senderName, senderEmail, subject, body }) {
  const fullText = `${subject} ${body} ${senderName} ${senderEmail}`.toLowerCase();

  let responsibility = 'Assistant to Reply';
  let segment = 'General';
  let confidence = 0.92;
  let whyClientNeeded = '';
  let summary = '';
  const extractedDates = [];
  let suggestedDraft = '';

  // 1. Receipts / automated confirmations / newsletters -> No Reply Needed
  if (
    fullText.includes('invoice') ||
    fullText.includes('receipt') ||
    fullText.includes('billing') ||
    fullText.includes('eticket') ||
    fullText.includes('confirmation') ||
    fullText.includes('tax report') ||
    fullText.includes('no-reply') ||
    fullText.includes('noreply') ||
    fullText.includes('statements')
  ) {
    responsibility = 'No Reply Needed';
    segment = 'General';
    confidence = 0.99;
    summary = `Automated notification regarding ${subject}. Transaction or status notice processed.`;
    suggestedDraft = 'No reply required. Automatically cataloged and archived.';
  }
  // 2. High-stakes executive decision / legal / board / equity / enterprise escalation -> Client to Reply
  else if (
    fullText.includes('term sheet') ||
    fullText.includes('signature') ||
    fullText.includes('board meeting') ||
    fullText.includes('director') ||
    fullText.includes('equity') ||
    fullText.includes('vesting') ||
    fullText.includes('renewal') && fullText.includes('escalation') ||
    fullText.includes('churn') ||
    fullText.includes('founder') ||
    fullText.includes('personal sign-off') ||
    fullText.includes('sla breach')
  ) {
    responsibility = 'Client to Reply';
    segment = fullText.includes('board') ? 'Important' : 'Action Required';
    confidence = 0.96;
    whyClientNeeded = `Requires Alex's direct executive authority as founder regarding contractual terms, board governance, or strategic relationship retention.`;
    summary = `${senderName} reached out regarding ${subject}. Key executive decision or legal authorization is requested.`;
    suggestedDraft = `Hi ${senderName.split(' ')[0]},\n\nThank you for flagging this. I have reviewed the details and will follow up shortly with our executive confirmation.\n\nBest,\nAlex`;
  }
  // 3. Waiting for response
  else if (
    fullText.includes('waiting on') ||
    fullText.includes('follow-up') ||
    fullText.includes('pending quote') ||
    fullText.includes('trademark') ||
    fullText.includes('status update')
  ) {
    responsibility = 'Waiting for Response';
    segment = 'Waiting for Response';
    confidence = 0.91;
    summary = `Pending response or deliverables from ${senderName} regarding ${subject}.`;
    suggestedDraft = `Hi ${senderName.split(' ')[0]},\n\nChecking in on the status of this item. Let us know if you need anything further from our team.\n\nBest,\nExecutive Office of Alex`;
  }
  // 4. Ambiguous / exploratory / anomaly -> Needs Review
  else if (
    fullText.includes('synergy') ||
    fullText.includes('off-the-record') ||
    fullText.includes('anomaly') ||
    fullText.includes('unusual spend') ||
    fullText.includes('exploratory')
  ) {
    responsibility = 'Needs Review';
    segment = 'Important';
    confidence = 0.67;
    whyClientNeeded = 'Intent is ambiguous or requires EA verification with engineering/strategic leadership before proceeding.';
    summary = `Inbound request from ${senderName} with ambiguous scope requiring triage review.`;
    suggestedDraft = `Hi ${senderName.split(' ')[0]},\n\nThank you for reaching out. Could you share more specific details regarding the agenda so we can route this appropriately?\n\nBest regards,\nExecutive Office of Alex`;
  }
  // 5. Scheduling / interview / catering / coordination -> Assistant to Reply
  else if (
    fullText.includes('podcast') ||
    fullText.includes('reschedule') ||
    fullText.includes('interview') ||
    fullText.includes('calendar') ||
    fullText.includes('retreat') ||
    fullText.includes('keynote') ||
    fullText.includes('speaking') ||
    fullText.includes('meeting')
  ) {
    responsibility = 'Assistant to Reply';
    segment = 'Meetings and Appointments';
    confidence = 0.94;
    summary = `${senderName} is coordinating scheduling or logistics regarding ${subject}.`;
    suggestedDraft = `Hi ${senderName.split(' ')[0]},\n\nThank you for reaching out! Elena here from Alex's office. We would be pleased to coordinate this. Looking at Alex's schedule, let's explore options for next week.\n\nBest regards,\nElena Rostova\nExecutive Assistant to Alex`;
  } else {
    responsibility = 'Assistant to Reply';
    segment = 'General';
    confidence = 0.88;
    summary = `Correspondence from ${senderName} regarding ${subject}.`;
    suggestedDraft = `Hi ${senderName.split(' ')[0]},\n\nThank you for your note. We have received your message and will review it with the team.\n\nBest regards,\nExecutive Office of Alex`;
  }

  // Extract dates if mentions found
  const timeRegex = /(tomorrow|today|monday|tuesday|wednesday|thursday|friday|saturday|sunday|dec \d+|nov \d+|jan \d+|\d{1,2}:\d{2}\s*(?:am|pm))/gi;
  const matches = body.match(timeRegex);
  if (matches && matches.length > 0) {
    extractedDates.push({
      title: `${subject.slice(0, 30)}...`,
      dateTimeText: matches.slice(0, 2).join(' / '),
      type: fullText.includes('deadline') || fullText.includes('due') || fullText.includes('by') ? 'Deadline' : 'Meeting',
    });
  }

  return {
    responsibility,
    confidence,
    segment,
    summary,
    whyClientNeeded,
    extractedDates,
    suggestedDraft,
  };
}

/**
 * Triage an incoming or simulated email using Gemini 2.5 Flash
 */
export async function triageEmailWithGemini(emailData, customApiKey = null) {
  const model = getGeminiModel(customApiKey);

  if (!model) {
    return heuristicTriage(emailData);
  }

  const prompt = `You are an elite Executive Assistant AI triage agent managing email inboxes for an executive founder (Alex Vance).
Analyze this incoming email thread and classify it with precision.

EMAIL SUBJECT: "${emailData.subject}"
SENDER: "${emailData.senderName}" <${emailData.senderEmail}>
BODY:
${emailData.body}

${emailData.threadHistory ? `THREAD HISTORY:\n${JSON.stringify(emailData.threadHistory, null, 2)}` : ''}

You must return a valid JSON object with EXACTLY this structure (no markdown fences, strictly parseable JSON):
{
  "responsibility": "Assistant to Reply" | "Client to Reply" | "No Reply Needed" | "Needs Review",
  "confidence": <number between 0.0 and 1.0>,
  "segment": "Action Required" | "Waiting for Response" | "Meetings and Appointments" | "Important" | "General",
  "summary": "<1-2 sentence executive summary of the conversation>",
  "whyClientNeeded": "<1 clear sentence explaining why the client must personally reply, or empty string if not Client to Reply>",
  "extractedDates": [
    {
      "title": "<short event title>",
      "dateTimeText": "<exact time string mentioned, e.g. 'Tomorrow at 11:00 AM EST'>",
      "type": "Meeting" | "Deadline"
    }
  ],
  "suggestedDraft": "<professional, complete, ready-to-send reply draft tailored to who is replying>"
}

Classification Guidelines:
- "Client to Reply": Only for high-stakes decisions requiring founder authority (term sheets, legal signatures, executive comp/hiring offers, board matters, critical customer escalations).
- "Assistant to Reply": Scheduling, podcast/media coordination, vendor logistics, banquet/catering riders, RSVP confirmations, travel coordination.
- "No Reply Needed": Automated notifications, receipts, billing statements, flight confirmations, legal tax receipts.
- "Needs Review": Low confidence, ambiguous exploratory corporate dev / M&A pitches, unexpected cloud billing alerts.
`;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Clean JSON response if wrapped in code blocks
    let cleanJson = responseText.trim();
    if (cleanJson.startsWith('```json')) {
      cleanJson = cleanJson.replace(/^```json/, '').replace(/```$/, '').trim();
    } else if (cleanJson.startsWith('```')) {
      cleanJson = cleanJson.replace(/^```/, '').replace(/```$/, '').trim();
    }

    const parsed = JSON.parse(cleanJson);
    return {
      responsibility: parsed.responsibility || 'Assistant to Reply',
      confidence: parsed.confidence || 0.9,
      segment: parsed.segment || 'General',
      summary: parsed.summary || 'Summary unavailable',
      whyClientNeeded: parsed.whyClientNeeded || '',
      extractedDates: Array.isArray(parsed.extractedDates) ? parsed.extractedDates : [],
      suggestedDraft: parsed.suggestedDraft || '',
    };
  } catch (err) {
    console.warn('Gemini 2.5 Flash triage call failed, falling back to heuristic engine:', err.message);
    return heuristicTriage(emailData);
  }
}

/**
 * Generate or refine an AI email draft with specified tone
 */
export async function generateDraftReply({ thread, tone = 'Professional', customInstructions = '', customApiKey = null }) {
  const model = getGeminiModel(customApiKey);

  const fallbackDrafts = {
    Professional: `Dear ${thread.senderName.split(' ')[0]},\n\nThank you for your message. We have reviewed your request regarding "${thread.subject}". Everything has been noted and we are proceeding accordingly.\n\nPlease let us know if you require any additional information.\n\nBest regards,\nAlex Vance`,
    Concise: `Hi ${thread.senderName.split(' ')[0]},\n\nLooks good to proceed on "${thread.subject}". Confirmed on our end.\n\nBest,\nAlex`,
    Warm: `Hi ${thread.senderName.split(' ')[0]},\n\nIt is wonderful hearing from you! Thank you so much for the detailed update on "${thread.subject}". We are really excited about this and looking forward to connecting soon.\n\nWarmest regards,\nAlex`,
  };

  if (!model) {
    if (customInstructions) {
      return `${fallbackDrafts[tone] || fallbackDrafts.Professional}\n\nNote: ${customInstructions}`;
    }
    return fallbackDrafts[tone] || fallbackDrafts.Professional;
  }

  const prompt = `You are drafting an email reply on behalf of Alex Vance (or Alex's Executive Assistant).
THREAD SUBJECT: "${thread.subject}"
SENDER: "${thread.senderName}" <${thread.senderEmail}>
MESSAGES IN THREAD:
${JSON.stringify(thread.messages || [], null, 2)}

TONE REQUESTED: "${tone}" (Options: Professional, Concise, Warm)
ADDITIONAL INSTRUCTIONS: "${customInstructions || 'None'}"

Draft a ready-to-send, polished email response. Do NOT include markdown fences or preamble. Just the email text.`;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (err) {
    console.warn('Gemini draft generation failed, using fallback:', err.message);
    return fallbackDrafts[tone] || fallbackDrafts.Professional;
  }
}

/**
 * Copilot Answer: "Ask AI About Inbox"
 */
export async function askInboxCopilot({ query, currentThread = null, allThreads = [], role = 'assistant', customApiKey = null }) {
  const model = getGeminiModel(customApiKey);

  // If Gemini model is available, use it with full context
  if (model) {
    const context = {
      userRole: role,
      totalThreads: allThreads.length,
      clientToReplyCount: allThreads.filter((t) => t.aiMetadata?.responsibility === 'Client to Reply' && t.status === 'Open').length,
      assistantToReplyCount: allThreads.filter((t) => t.aiMetadata?.responsibility === 'Assistant to Reply' && t.status === 'Open').length,
      waitingCount: allThreads.filter((t) => t.aiMetadata?.segment === 'Waiting for Response' && t.status === 'Open').length,
      threadsSummary: allThreads.map((t) => ({
        id: t.id,
        subject: t.subject,
        sender: `${t.senderName} (${t.senderEmail})`,
        provider: t.provider,
        responsibility: t.aiMetadata?.responsibility,
        segment: t.aiMetadata?.segment,
        summary: t.aiMetadata?.summary,
        whyClientNeeded: t.aiMetadata?.whyClientNeeded,
        status: t.status,
      })),
      selectedThread: currentThread
        ? {
            id: currentThread.id,
            subject: currentThread.subject,
            sender: `${currentThread.senderName} (${currentThread.senderEmail})`,
            responsibility: currentThread.aiMetadata?.responsibility,
            whyClientNeeded: currentThread.aiMetadata?.whyClientNeeded,
            summary: currentThread.aiMetadata?.summary,
            messages: currentThread.messages,
            suggestedDraft: currentThread.aiMetadata?.suggestedDraft,
          }
        : null,
    };

    const prompt = `You are "MailPulse Copilot", an elite AI assistant embedded in an executive email management dashboard.
You are helping the user (Role: ${role === 'client' ? 'Client / Founder (Alex Vance)' : 'Executive Personal Assistant (Elena)'}).

CURRENT INBOX STATE & CONTEXT:
${JSON.stringify(context, null, 2)}

USER INQUIRY: "${query}"

Provide a concise, helpful, and direct response in markdown format. Use bullet points and bold highlights where appropriate. If asked to draft a reply or summarize a conversation, refer directly to the selected conversation or relevant inbox emails.`;

    try {
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (err) {
      console.warn('Gemini copilot call failed, falling back to smart local response:', err.message);
    }
  }

  // Smart Heuristic Response Handler matching the evaluation chips & common questions
  const q = query.toLowerCase();

  // 1. "Show me emails that need my attention."
  if (q.includes('need my attention') || q.includes('my attention')) {
    if (role === 'client') {
      const clientThreads = allThreads.filter(
        (t) => t.aiMetadata?.responsibility === 'Client to Reply' && t.status === 'Open'
      );
      if (clientThreads.length === 0) {
        return "✨ **Your queue is clean!** There are currently no emails requiring your personal input. Your executive assistant is handling everything else.";
      }
      return `### 👔 Emails Requiring Your Personal Attention (${clientThreads.length})
Here are the items requiring your personal founder input:

${clientThreads
  .map(
    (t, idx) =>
      `${idx + 1}. **${t.subject}** (${t.senderName})\n   * **Reason:** ${t.aiMetadata?.whyClientNeeded || 'Direct decision required.'}\n   * **Action:** Review draft or click *Hand Over to Assistant*.`
  )
  .join('\n\n')}`;
    } else {
      const assistantThreads = allThreads.filter(
        (t) => t.aiMetadata?.responsibility === 'Assistant to Reply' && t.status === 'Open'
      );
      return `### 👩💼 Emails Assigned to Assistant (${assistantThreads.length})
You have **${assistantThreads.length} active threads** ready for your response:

${assistantThreads
  .slice(0, 5)
  .map(
    (t, idx) =>
      `${idx + 1}. **${t.subject}** (${t.senderName})\n   * **AI Summary:** ${t.aiMetadata?.summary}\n   * **Draft Status:** AI reply prepared and ready for approval.`
  )
  .join('\n\n')}`;
    }
  }

  // 2. "Summarize this conversation."
  if (q.includes('summarize this conversation') || q.includes('summarize')) {
    if (!currentThread) {
      return "⚠️ **No conversation selected.** Please select an email thread from the inbox list, and I'll generate a comprehensive summary for you.";
    }
    return `### 📋 Conversation Summary: "${currentThread.subject}"
**Sender:** ${currentThread.senderName} (${currentThread.senderEmail})  
**Provider:** ${currentThread.provider} | **Responsibility:** \`${currentThread.aiMetadata?.responsibility}\`

**Executive Overview:**  
${currentThread.aiMetadata?.summary}

${
  currentThread.aiMetadata?.whyClientNeeded
    ? `**Why Client Decision is Critical:**  
${currentThread.aiMetadata.whyClientNeeded}\n`
    : ''
}
${
  currentThread.aiMetadata?.extractedDates?.length > 0
    ? `**Key Dates & Deadlines:**  
${currentThread.aiMetadata.extractedDates.map((d) => `* **${d.title}**: ${d.dateTimeText} (${d.type})`).join('\n')}\n`
    : ''
}
**Message Count:** ${currentThread.messages?.length || 1} message(s) in this thread.`;
  }

  // 3. "What am I waiting for a response on?"
  if (q.includes('waiting for a response') || q.includes('waiting')) {
    const waitingThreads = allThreads.filter(
      (t) => t.aiMetadata?.segment === 'Waiting for Response' && t.status === 'Open'
    );
    if (waitingThreads.length === 0) {
      return "You have no outstanding emails marked as **Waiting for Response**.";
    }
    return `### ⏳ Pending Responses (${waitingThreads.length})
Here are the threads where we are awaiting counterpart actions:

${waitingThreads
  .map(
    (t, idx) =>
      `${idx + 1}. **${t.subject}**  
   * **Contact:** ${t.senderName} (${t.senderEmail})  
   * **Status:** ${t.aiMetadata?.summary}  
   * **Expected SLA:** ${t.aiMetadata?.extractedDates?.[0]?.dateTimeText || 'Follow-up pending'}`
  )
  .join('\n\n')}`;
  }

  // 4. "Which emails require the client's attention?"
  if (q.includes("client's attention") || q.includes('require the client')) {
    const clientThreads = allThreads.filter(
      (t) => t.aiMetadata?.responsibility === 'Client to Reply' && t.status === 'Open'
    );
    return `### 👔 Client Attention Needed (${clientThreads.length} Threads)
The following threads are routed to Alex (Founder/Client) because they cannot be delegated without founder authority:

${clientThreads
  .map(
    (t, idx) =>
      `${idx + 1}. **${t.subject}**  
   * **Sender:** ${t.senderName}  
   * **Founder Authority Rationale:** ${t.aiMetadata?.whyClientNeeded}  
   * **Deadline:** ${t.aiMetadata?.extractedDates?.[0]?.dateTimeText || 'None specified'}`
  )
  .join('\n\n')}`;
  }

  // 5. "Why has this email been assigned to the client?"
  if (q.includes('why has this email been assigned') || q.includes('why')) {
    if (!currentThread) {
      return "Please select a specific email thread first to analyze why it was assigned.";
    }
    if (currentThread.aiMetadata?.responsibility === 'Client to Reply') {
      return `### 🔍 Assignment Rationale for "${currentThread.subject}"
**Assigned To:** \`Client to Reply\` (Confidence: ${(currentThread.aiMetadata?.confidence * 100).toFixed(0)}%)

**Founder Authority Trigger:**  
> "${currentThread.aiMetadata?.whyClientNeeded || 'This item involves legal, board, financial, or key partnership authorization.'}"

**AI Classification Factors:**
* Direct founder signature or cap table decision.
* Strategic escalation not delegable to operational staff.
* High contractual or fiduciary impact.`;
    } else {
      return `### ℹ️ Current Assignment
This thread is currently classified as **\`${currentThread.aiMetadata?.responsibility}\`**.

* **AI Summary:** ${currentThread.aiMetadata?.summary}  
* **Manually Overridden:** ${currentThread.aiMetadata?.manuallyOverridden ? 'Yes' : 'No'}  
If you would like to assign this to the Client, you can use the **Manual Override dropdown** in the intelligence card or ask me to reassign it.`;
    }
  }

  // 6. "Draft a reply to this conversation."
  if (q.includes('draft a reply') || q.includes('draft')) {
    if (!currentThread) {
      return "Please select a conversation to generate a draft reply.";
    }
    return `### ✍️ Suggested Reply Draft for "${currentThread.subject}"

\`\`\`text
${currentThread.aiMetadata?.suggestedDraft || 'Draft in preparation...'}
\`\`\`

💡 *You can approve and send this directly from the AI Reply Composer in the right pane, or customize the tone (Professional, Concise, Warm).*`;
  }

  // Default fallback answer
  return `### 🤖 MailPulse Inbox Copilot
I am continuously analyzing your synced Gmail and Outlook inboxes.

* **Total Threads:** ${allThreads.length}
* **Client to Reply:** ${allThreads.filter((t) => t.aiMetadata?.responsibility === 'Client to Reply').length}
* **Assistant to Reply:** ${allThreads.filter((t) => t.aiMetadata?.responsibility === 'Assistant to Reply').length}
* **Needs Review:** ${allThreads.filter((t) => t.aiMetadata?.responsibility === 'Needs Review').length}

Try asking one of the suggested chips above, or ask me to draft a response, check meeting dates, or explain any triage assignment!`;
}
