/** Content for the BPM page (/admin/process). Mirrors the project plan, sections 3 and 4. */

export const asIsSteps = [
  { step: 1, activity: "Visitor searches social profiles or scattered documents for information.", problem: "Information is fragmented." },
  { step: 2, activity: "Visitor sends an informal message through a social or email channel.", problem: "The message may lack project details or a clear category." },
  { step: 3, activity: "Owner receives and manually interprets the request.", problem: "Requests are difficult to organize and prioritize." },
  { step: 4, activity: "Owner searches the message history and replies.", problem: "Follow-up and status are not consistently tracked." },
  { step: 5, activity: "Request is considered finished without a centralized record.", problem: "No dependable process history or performance data." },
];

export const toBeSteps = [
  { step: 1, activity: "Visitor opens the portfolio and reviews profile, skills and projects.", role: "Visitor", result: "Relevant portfolio information is presented." },
  { step: 2, activity: "Visitor selects an inquiry type and completes the required fields.", role: "Visitor", result: "Structured inquiry input is collected." },
  { step: 3, activity: "System validates required fields, email format, message limits and consent.", role: "System", result: "Invalid input is returned for correction." },
  { step: 4, activity: "System stores a valid inquiry with a timestamp and initial “New” status.", role: "System", result: "A traceable inquiry record is created." },
  { step: 5, activity: "System displays a submission confirmation.", role: "System", result: "Visitor knows the request was received." },
  { step: 6, activity: "Owner reviews the inquiry and updates its status (In Review, Responded, Closed).", role: "Owner", result: "Work is visible and trackable." },
  { step: 7, activity: "System records status history and timestamps for reporting.", role: "System", result: "Process history and KPI data are available." },
];

export const bpmConcepts = [
  { concept: "Business process", how: "Visitor discovery and inquiry handling from website entry through owner response." },
  { concept: "Input, activities, people, technology, decisions, output", how: "Visitor details and message enter the process; the form validates; the owner reviews; the system records status; a confirmation is returned." },
  { concept: "As-Is and To-Be", how: "An informal contact approach is compared with a structured online inquiry workflow." },
  { concept: "Business Process Improvement (BPI)", how: "Form validation and centralized records reduce missing information, repeated clarification and untracked messages." },
  { concept: "Performance measures", how: "Inquiry volume, response time, open workload and status distribution are calculated from stored records." },
];

export const processElements = [
  { element: "Trigger", detail: "A visitor decides to contact the portfolio owner." },
  { element: "Inputs", detail: "Inquiry type, name, email, subject, message, consent." },
  { element: "People / roles", detail: "Visitor (public) and Owner (authenticated administrator); the System performs validation and recording." },
  { element: "Technology", detail: "Next.js server action, Supabase PostgreSQL with Row Level Security, Supabase Auth." },
  { element: "Decision points", detail: "Is the input valid? Which status comes next (In Review → Responded or Closed)?" },
  { element: "Outputs", detail: "Confirmation to the visitor; stored inquiry and history; KPI data for the owner." },
];

export const kpiDefinitions = [
  { kpi: "Inquiry volume", definition: "Count of valid inquiries received in the selected date range.", tells: "Demand entering the process." },
  { kpi: "Open inquiries", definition: "Count of records with New or In Review status (all time — a current workload measure).", tells: "Work needing attention now." },
  { kpi: "Response time", definition: "first_response_at − created_at; average and median, only for inquiries that have a response.", tells: "How long visitors wait for a first response." },
  { kpi: "Closure time", definition: "closed_at − created_at for closed inquiries.", tells: "End-to-end handling duration." },
  { kpi: "Status distribution", definition: "Inquiries in the range grouped by current status.", tells: "Where work is concentrated or delayed." },
];
