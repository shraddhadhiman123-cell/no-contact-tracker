const DEFAULT_STATE = {
    hasStarted: false,
    exName: '',
    startDate: null,
    reasons: [],
    selectedPlan: '30',
    completedTasks: [], // Array of day numbers completed
    temptationsDefeated: 0,
    journalEntries: [],
    userPosts: [], // Tracks community posts the user created
    likedPosts: [], // Tracks ids of posts liked by the user
    achievements: [],
    activeDaySelected: 1, // For plan preview
    subscription: 'lifetime', // 'free', 'monthly', 'lifetime'
    checkedInDays: {}, // YYYY-MM-DD -> { mood: 5, sleep: 3, temptation: 0 }
    readArticlesCount: 0,
    readArticlesList: [], // List of read article IDs
    soundEffects: true,
    unsentLettersVault: [], // Saved letters (lifetime/pro vault feature)
    openAiApiKey: '',
    coachVibe: 'scientific',
    postComments: {} // Maps postId -> Array of comments
};

let state = { ...DEFAULT_STATE };

// Healing Stages Definition
const STAGES = [
    {
        minDays: 0,
        maxDays: 5,
        title: "Withdrawal Phase (Days 1-5)",
        desc: "Your brain is craving the dopamine hit of contact. It feels physically painful right now, but this is a detox phase. Every second you hold on, your brain recalibrates. You are stronger than a chemical urge."
    },
    {
        minDays: 6,
        maxDays: 15,
        title: "Anger & Realization (Days 6-15)",
        desc: "As the immediate shock wears off, anger might emerge. Use this energy to focus on self-improvement. Remind yourself why you chose No Contact. Reclaim your personal boundaries."
    },
    {
        minDays: 16,
        maxDays: 30,
        title: "Habit Reset (Days 16-30)",
        desc: "Your daily routine is shifting. You are learning to walk without them. Keep your distance, rebuild your network, and focus on clean schedules."
    },
    {
        minDays: 31,
        maxDays: 60,
        title: "Self-Discovery & Redirection (Days 31-60)",
        desc: "The urge is fading. You are rediscovering old passions and hobbies. Reinvest your mental energy back into your dreams, health, and career."
    },
    {
        minDays: 61,
        maxDays: 9999,
        title: "Acceptance & Inner Peace (Days 61+)",
        desc: "Acceptance is settling in. You look back with gratitude for your growth instead of longing for the past. You have officially reclaimed your freedom."
    }
];

// Recovery Tasks for the 30-Day Calendar
const PLAN_TASKS = [
    { day: 1, title: "Physical Cleanse", desc: "Delete or archive their chats. Hide physical photos, gifts, or items that trigger waves of grief. Clear your physical space." },
    { day: 2, title: "Write your 'Why' List", desc: "List all the raw reasons why the relationship ended and why contact will harm your progress. Keep it in your wallet or on your phone." },
    { day: 3, title: "Reach Out to a Friend", desc: "Call or text a trusted friend. Tell them you are starting No Contact and might need support when the urge strikes." },
    { day: 4, title: "Social Media Mute", desc: "Unfollow, mute, or block your ex's social media. Checking up on them is a form of contact that restarts your withdrawal timer." },
    { day: 5, title: "A Calming Treat", desc: "Do one thing purely for comfort: order your favorite food, watch a cozy movie, or take a hot bath. Pamper your nervous system." },
    { day: 6, title: "30-Min Nature Walk", desc: "Walk outdoors without looking at your phone. Focus on the sounds, birds, and fresh air to ground yourself." },
    { day: 7, title: "First Week Milestone", desc: "Celebrate 7 days of self-control! Treat yourself to a small reward (a book, a coffee, or a relaxing day)." },
    { day: 8, title: "Emotional Brain Dump", desc: "Open your journal and write down all the negative emotions you are holding. Don't filter, let it pour out." },
    { day: 9, title: "No-Breakup Playlist", desc: "Create a music playlist with zero sad or romantic breakup songs. Fill it with uplifting, energetic, or neutral beats." },
    { day: 10, title: "Digital Detoxing", desc: "Turn off all screens 2 hours before bed. Read a physical book, stretch, or meditate to soothe sleep anxiety." },
    { day: 11, title: "Letter of Forgiveness", desc: "Write a letter to yourself forgiving your past actions and acknowledging your worth. Burn it or archive it in the Unsent letter box." },
    { day: 12, title: "Hydration Focus", desc: "Drink at least 8 cups of water today. Physical health supports emotional regulation." },
    { day: 13, title: "Rearrange Your Space", desc: "Move furniture, buy a houseplant, or reorganize your desk. Shift the energy of your living environment." },
    { day: 14, title: "Cook a New Recipe", desc: "Try cooking a healthy meal from scratch. Focus on the physical process of cutting, stirring, and cooking." },
    { day: 15, title: "Halfway Victory", desc: "You have survived 15 days of No Contact! Acknowledge how the physical anxiety has lessened since Day 1." },
    { day: 16, title: "Revisit an Old Hobby", desc: "Spend 45 minutes on a hobby you neglected during the relationship (drawing, gaming, reading, coding, etc.)." },
    { day: 17, title: "Gentle Stretching", desc: "Do 15 minutes of full-body stretching or yoga. Release physical tension stored in your hips and shoulders." },
    { day: 18, title: "Write Future Goals", desc: "List 3 things you want to achieve in the next 6 months that have absolutely nothing to do with your ex." },
    { day: 19, title: "Wardrobe Refresh", desc: "Declutter your closet. Donate clothes that remind you of the past or no longer fit your aesthetic." },
    { day: 20, title: "No Contact Review", desc: "Review your reasons list. Reflect on how much clearer your mind is now compared to two weeks ago." },
    { day: 21, title: "Three-Week Triumph", desc: "21 days completes a habit loop. Your brain has officially formed new neural paths." },
    { day: 22, title: "Sleep Schedule Fix", desc: "Go to bed and wake up at the exact same times. Sleep heals chemical anxiety." },
    { day: 23, title: "Call a Family Member", desc: "Rebuild family connections. Talk about their life, listen, and share your recovery updates." },
    { day: 24, title: "Volunteer or Help", desc: "Do a small act of kindness: help a colleague, clean up a park, or feed a stray animal. Shift focus outwards." },
    { day: 25, title: "Watch a Documentary", desc: "Expand your world view. Learn about something entirely new to keep your brain occupied." },
    { day: 26, title: "A Letter to Your Ex (Unsent)", desc: "Write a final closure letter saying everything you need to say. Dump it in the emergency unsent box. Do NOT send." },
    { day: 27, title: "Explore a New Place", desc: "Visit a museum, library, cafe, or park in your city where you never went with your ex. Create new memories." },
    { day: 28, title: "Gratitude List", desc: "Write down 5 things you are grateful for having in your life right now, focusing on your growth." },
    { day: 29, title: "Plan Your Future Week", desc: "Schedule dinners, workouts, or classes for next week to prevent empty time from triggering nostalgia." },
    { day: 30, title: "30 Days of Freedom", desc: "Congratulations! You have completed the 30-Day Reset. You have proven you can live, breathe, and thrive on your own." }
];

// Daily Affirmation Deck (Gen Z & Empowering)
const AFFIRMATIONS = [
    "Bestie, self-respect looks way too good on you to fold now. 💅",
    "Ex is temporary, main character glow-up is forever. ✨",
    "No Contact is not a game to win them back; it is a boundary to win yourself back. 👑",
    "Put the clown nose down. You are a king/queen, not option C. 🤡",
    "They are not missing you; they are missing the convenience of your absolute premium energy. 💅",
    "Your worth does not drop because someone didn't have the taste to appreciate you. 📈",
    "Screaming, crying, throwing up is a valid phase, but texting them will make it 10x worse. 😭",
    "Every day of silence is a day of rebuilding your self-respect. Let's get it. ⚡",
    "No closure from them is the ultimate closure. Walk away and thrive. 🔒",
    "We are choosing our future self over temporary delusional feelings today. ✨",
    "You dropped this, bestie: 👑. Pick it up and stay strong."
];

// Articles library contents (Scientific & SEO-Friendly)
const ARTICLES = {
    "1": {
        title: "The Science of Breakup Withdrawal",
        category: "Neuroscience",
        keywords: "breakup brain science, heartbreak neuroscience",
        readTime: "4 min read",
        author: "Dr. Elena Rostova, PhD",
        content: `
            <p>Did you know that going through a breakup activates the exact same regions of the brain as physical pain and substance withdrawal? When you are in a relationship, your brain is flooded with dopamine, oxytocin, and serotonin. You are, quite literally, addicted to your partner.</p>
            <h3>The Dopamine Crash</h3>
            <p>When the bond is suddenly severed, your brain experiences a severe drop in these reward chemicals. This causes your brain to go into emergency withdrawal, prompting an intense craving to contact them just to get a 'hit' of safety. This explains why you feel physical chest pains, insomnia, and obsessive loops.</p>
            <h3>How to Survive</h3>
            <p>To heal, you must treat your brain like it is in detox:
            <ul>
                <li><strong>Cold Turkey:</strong> Any text, photo review, or profile check resets the chemical withdrawal timer back to day zero.</li>
                <li><strong>Dopamine Replacement:</strong> Find healthy sources of dopamine: exercise, warm baths, herbal teas, or speaking with friends.</li>
                <li><strong>Time is a Filter:</strong> Realize that the physical panic peaks in the first 14 days and drops exponentially thereafter as receptors adjust.</li>
            </ul>
            </p>
            <p>Remember: You aren't crazy for feeling this intense pain. Your brain is simply recalibrating itself. Hold on, and let it heal.</p>
        `
    },
    "2": {
        title: "The Golden Rules of No Contact",
        category: "Boundaries",
        keywords: "no contact rule, no contact rule psychology",
        readTime: "5 min read",
        author: "Marcus Vance, Clinical Therapist",
        content: `
            <p>The No Contact Rule is simple in theory, but highly challenging in practice. To ensure its success, you must understand what counts as contact, and why making exceptions destroys progress.</p>
            <h3>What is Contact?</h3>
            <p>Contact is any outward transmission of energy toward your ex. This includes:
            <ul>
                <li>Texting, calling, emailing, or mailing letters.</li>
                <li>Liking or commenting on their social media accounts.</li>
                <li>Viewing their Instagram stories or checking WhatsApp status (creates silent attachment).</li>
                <li>Asking mutual friends how they are doing.</li>
            </ul>
            </p>
            <h3>The Golden Rules</h3>
            <p><strong>Rule 1: No Birthday Texts.</strong> A birthday text is an excuse to break boundaries. It invites a cold response or, worse, starting conversations that lead to relapse.</p>
            <p><strong>Rule 2: Do Not Answer Breadcrumbs.</strong> 'I miss you' or 'How are you' without a clear attempt to reconcile are breadcrumbs. They use your response to soothe their own guilt. Remain silent.</p>
            <p><strong>Rule 3: Set an Emergency Contact.</strong> If you feel like typing to them, type to a friend or write in this app's Unsent Letter box.</p>
        `
    },
    "3": {
        title: "Reclaiming Your Identity After Relationship Loss",
        category: "Self-Care",
        keywords: "social media after breakup, unfollow ex",
        readTime: "4 min read",
        author: "Dr. Sarah Jenkins, PsyD",
        content: `
            <p>During a relationship, our identities become intertwined with our partner's. We think in terms of 'us' instead of 'me'. When a breakup occurs, we lose not just a partner, but our self-concept. Reclaiming your identity is the central task of moving on.</p>
            <h3>The Self-Concept Expansion</h3>
            <p>Psychologists refer to this recovery phase as expanding the self-concept. You must actively rebuild the boundaries of who you are:
            <ul>
                <li><strong>Revisit the Past:</strong> What did you love doing before you met them? Painting? Hiking? Writing code? Revisit those activities immediately.</li>
                <li><strong>New Habits:</strong> Form routines that belong purely to you. Buy coffee from a new shop, take a new route to work, or try a new style.</li>
                <li><strong>Separate Your Goals:</strong> Write down goals that are 100% about you. Focus on your health, wealth, and spiritual growth.</li>
            </ul>
            </p>
            <p>Reclaiming your identity is a beautiful process. It is your opportunity to rebuild yourself exactly as you wish to be.</p>
        `
    },
    "4": {
        title: "What to Do When You Relapse",
        category: "Healing",
        keywords: "dating after breakup, rebound relationship psychology",
        readTime: "5 min read",
        author: "Chloe Mercer, Breakup Specialist",
        content: `
            <p>You broke No Contact. Maybe you texted them in a moment of weakness, or called them late at night. The most important thing to do right now is: <strong>Do not shame yourself.</strong></p>
            <h3>Why Shame is Dangerous</h3>
            <p>Shame triggers a spiral. When you feel ashamed, your brain feels worse, and it will search for the quickest comfort—which is often looking at your ex's photos or texting them again. Forgive yourself. Relapse is a normal part of recovery.</p>
            <h3>The Step-by-Step Reset Plan</h3>
            <p>
            <ol>
                <li><strong>Stop the conversation immediately:</strong> Do not try to explain, justify, or argue. Simply stop responding.</li>
                <li><strong>Accept the outcome:</strong> Whether they responded coldly, warmly, or not at all, accept it as information that contact is unsafe.</li>
                <li><strong>Reset the App Clock:</strong> Go to settings or click reset and set a new start date. Be honest. This is about your healing journey.</li>
                <li><strong>Document the feeling:</strong> Write down exactly how you feel after breaking contact in your journal. Next time you want to text, read this entry.</li>
            </ol>
            </p>
            <p>Every relapse is a lesson. You are stronger today than you were before. Pick up your shield and start again.</p>
        `
    },
    "5": {
        title: "The Dopamine Detox: Why Your Ex Was Like a Drug",
        category: "Neuroscience",
        keywords: "breakup dopamine withdrawal, love addiction",
        readTime: "4 min read",
        author: "Dr. Elena Rostova, PhD",
        content: `
            <p>Romantic love utilizes the same neural pathways as chemical addiction. When you receive a text message from a loved one, your brain releases a surge of dopamine—the pleasure and anticipation chemical. Over time, your nervous system associates their presence with survival itself.</p>
            <h3>Intermittent Reinforcement</h3>
            <p>If your relationship had high highs and low lows, the addiction is even stronger. Psychologists call this intermittent reinforcement. When your partner is inconsistent, your brain obsesses more, waiting for the next dopamine spike. This makes the breakup feel like a literal drug detox.</p>
            <h3>Detoxing the Circuits</h3>
            <p>To detoxify:
            <ul>
                <li>Avoid checking their social updates: even a glance triggers a dopamine micro-spike, extending the craving cycle.</li>
                <li>Accept the flatline phase: your brain will feel bored and empty for a few weeks. This is your dopamine receptors recalibrating to natural baselines.</li>
            </ul>
            </p>
        `
    },
    "6": {
        title: "Cortisol and Heartbreak: Breakup Stress Response",
        category: "Neuroscience",
        keywords: "breakup stress cortisol, physical effects breakup",
        readTime: "5 min read",
        author: "Dr. Sarah Jenkins, PsyD",
        content: `
            <p>Have you felt a deep ache in your chest, digestive distress, or chronic fatigue since the breakup? These are not purely psychological; they are the physical effects of cortisol, the primary stress hormone.</p>
            <h3>The Fight-or-Flight Response</h3>
            <p>A relationship rupture is registered by the amygdala as an emergency threat to safety. This triggers a massive, prolonged release of cortisol and adrenaline. Excess cortisol weakens the immune system, disrupts digestion, and causes muscle tightness (particularly around the chest and stomach).</p>
            <h3>Flushing Cortisol</h3>
            <p>To reduce cortisol levels:
            <ul>
                <li><strong>Cardio Exercise:</strong> Running or swimming for 20 minutes physically burns off stress hormones.</li>
                <li><strong>Vagus Nerve Stimulation:</strong> Take deep, slow breaths where your exhale is longer than your inhale. This triggers the parasympathetic nervous system to shut off the stress alarm.</li>
            </ul>
            </p>
        `
    },
    "7": {
        title: "Anxious Attachment Style After a Breakup",
        category: "Attachment Theory",
        keywords: "anxious attachment breakup, checking ex social media",
        readTime: "6 min read",
        author: "Marcus Vance, Clinical Therapist",
        content: `
            <p>If you have an anxious attachment style, a breakup triggers your core abandonment wound. This results in 'protest behaviors'—compulsive attempts to re-establish connection, such as calling repeatedly, showing up at their house, or obsessively checking their social media.</p>
            <h3>Understanding the Panic</h3>
            <p>When an anxious person's attachment system is activated, their prefrontal cortex (logic center) goes offline. The mind enters a panic loop that screams: 'If I don't contact them, I will cease to exist.' This panic is a cellular memory, not a logical evaluation of the relationship.</p>
            <h3>Soothe the Attachment System</h3>
            <p>Instead of contacting your ex:
            <ul>
                <li>Acknowledge the panic: say out loud, 'My attachment system is activated. I am safe in this room right now.'</li>
                <li>Physical grounding: wrap yourself in a heavy blanket or press your feet firmly against the floor. This signals physical safety to the nervous system.</li>
            </ul>
            </p>
        `
    },
    "8": {
        title: "The Closure Myth: Why Walking Away is Your Healing",
        category: "Psychology",
        keywords: "unfinished relationship psychology, closure myth",
        readTime: "4 min read",
        author: "Dr. Elena Rostova, PhD",
        content: `
            <p>Many people delay their healing by chasing 'closure'. They believe that one final conversation, explanation, or apology from their ex will dissolve the pain. In reality, chasing closure is often a subconscious excuse to see them one more time.</p>
            <h3>Why You Don't Need an Apology</h3>
            <p>Waiting for an ex to give you closure hands them control over your emotional state. Often, the ex is incapable of offering the apology or explanation you deserve. Seeking their input only results in further gaslighting or emotional confusion.</p>
            <h3>Self-Generated Closure</h3>
            <p>Closure is not something you receive; it is something you create. Your closure is the decision to accept the situation as it is, establish strict boundaries, and reinvest your energy in your own life.</p>
        `
    },
    "9": {
        title: "Cognitive Behavioral Reframing for Rumination",
        category: "Psychology",
        keywords: "stop thinking about ex, breakup rumination CBT",
        readTime: "5 min read",
        author: "Dr. Sarah Jenkins, PsyD",
        content: `
            <p>Do you replay the relationship's final days, wondering what you could have done differently? This is rumination. While it feels like problem-solving, it is actually an emotional trap that keeps you stuck in the past.</p>
            <h3>CBT Reframing Techniques</h3>
            <p>To interrupt the rumination cycle:
            <ul>
                <li><strong>Thought Stopping:</strong> When you notice a memory loop, say 'STOP' out loud or snap a rubber band on your wrist to interrupt the neural pattern.</li>
                <li><strong>Cognitive Reframing:</strong> Challenge negative thoughts. Change 'I will never find anyone like them' to 'I am now free to find someone who offers the emotional safety and consistency I deserve.'</li>
            </ul>
            </p>
        `
    },
    "10": {
        title: "Neuroplasticity: How Your Brain Rewires After 90 Days",
        category: "Neuroscience",
        keywords: "neuroplasticity breakup, brain rewire no contact",
        readTime: "5 min read",
        author: "Dr. Elena Rostova, PhD",
        content: `
            <p>The human brain is neuroplastic—it adapts and rewires itself based on your repeated actions. When you go no contact, you stop firing the neural pathways associated with your ex. Eventually, those connections weaken, and new ones form.</p>
            <h3>The 90-Day Mark</h3>
            <p>Clinical studies show that it takes approximately 90 days of consistent behavioral change to form permanent neural habits. At the start, maintaining boundaries feels exhausting. By Day 30, it becomes manageable. By Day 90, your brain has built a new self-concept baseline.</p>
            <p>Every single day you choose your self-respect over a text message, you are physically building a stronger brain. Keep going.</p>
        `
    }
};

// Simulated Seed posts for the community
const SEED_COMMUNITY_POSTS = [
    {
        id: "seed-1",
        tag: "Milestone",
        author: "HopefulHealer",
        time: "3 hours ago",
        content: "Completed Day 7! Yesterday was brutal. I sat with my phone in hand for an hour wanting to text Alex. Instead, I forced myself to write in the Unsent Message box here and watched it burn. Today, I woke up feeling so proud of my strength. If you are struggling on Day 1 or 2, hang in there. It gets easier!",
        likes: 42,
        commentsCount: 3
    },
    {
        id: "seed-2",
        tag: "Support",
        author: "LoomingMist",
        time: "6 hours ago",
        content: "I saw they deleted all our pictures on Instagram today. It feels like a physical punch in the stomach. I feel forgotten and thrown away. Someone please tell me it's normal to feel this broken.",
        likes: 28,
        commentsCount: 9
    },
    {
        id: "seed-3",
        tag: "Advice",
        author: "PhoenixRise",
        time: "1 day ago",
        content: "One thing that helped me maintain No Contact: Rename their contact on your phone to 'DO NOT DO IT' or 'SELF RESPECT'. Better yet, delete the number. If you have it memorized, block them on everything and delete the history. You cannot heal if you keep looking at the door.",
        likes: 67,
        commentsCount: 2
    },
    {
        id: "seed-4",
        tag: "Vent",
        author: "TangledHeart",
        time: "2 days ago",
        content: "I still check my phone every time it buzzes, hoping it's them. Even though they treated me like option C. I hate that I still care this much.",
        likes: 19,
        commentsCount: 5
    }
];

// ==========================================================================
// UTILITIES & STATE CONTROLLER
// ==========================================================================
function saveState() {
    localStorage.setItem('no_contact_state', JSON.stringify(state));
}

function loadState() {
    const saved = localStorage.getItem('no_contact_state');
    if (saved) {
        try {
            state = { ...DEFAULT_STATE, ...JSON.parse(saved) };
            // Enforce developer test Pro access
            state.subscription = 'lifetime';
        } catch (e) {
            console.error("Failed to parse state, using default", e);
            state = { ...DEFAULT_STATE };
        }
    } else {
        state = { ...DEFAULT_STATE };
    }
}

// ==========================================================================
// TOAST NOTIFICATIONS & SUBSCRIPTION GATEWAY
// ==========================================================================
function showToast(title, desc, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let iconClass = 'fa-info-circle';
    if (type === 'success') iconClass = 'fa-check-circle';
    else if (type === 'warning') iconClass = 'fa-exclamation-triangle';
    else if (type === 'error') iconClass = 'fa-exclamation-circle';

    toast.innerHTML = `
        <div class="toast-icon"><i class="fa-solid ${iconClass}"></i></div>
        <div class="toast-content">
            <div class="toast-title">${escapeHTML(title)}</div>
            <div class="toast-desc">${escapeHTML(desc)}</div>
        </div>
    `;

    container.appendChild(toast);

    // Slide-out and remove
    setTimeout(() => {
        toast.classList.add('removing');
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

const PRO_FEATURES = {
    therapist: { title: "AI Therapist Coaching", desc: "Unlock unlimited chats with your compassionate breakup guide (Free plan gets 3 messages/day)." },
    checkin: { title: "Daily Check-Ins", desc: "Unlock daily tracking of your mood, sleep, and cravings to log your recovery metrics." },
    analytics: { title: "Mood Analytics Charts", desc: "Unlock beautiful trend lines, sleep tracking bars, and craving frequency heatmaps." },
    meditation: { title: "Guided Meditations", desc: "Unlock audio-free breathing guides and themed meditations to release relationship panic." },
    blogs: { title: "Scientific Blog Library", desc: "Unlock unlimited access to the entire vault of SEO-friendly breakup science articles." },
    comments: { title: "Community Interaction", desc: "Post replies and comments to connect deeply with other healers in the safety net." }
};

let activePaywallFeature = null;

function requiresPro(featureKey) {
    if (state.subscription !== 'free') return false; // Premium users get everything
    
    // Check if therapist daily message limit is reached
    if (featureKey === 'therapist') {
        const todayStr = new Date().toISOString().slice(0, 10);
        const msgsToday = state.journalEntries.filter(
            e => e.type === 'chat_user_msg' && e.dateStr === todayStr
        ).length;
        if (msgsToday < 3) {
            return false; // Under the limit
        }
    }

    // Check if blog free count is reached
    if (featureKey === 'blogs') {
        if (state.readArticlesCount < 3) {
            return false; // Free articles remaining
        }
    }
    
    activePaywallFeature = featureKey;
    const feature = PRO_FEATURES[featureKey] || { title: "Premium Feature", desc: "Unlock this premium tool to accelerate your recovery." };
    
    const paywallModal = document.getElementById('paywall-modal');
    const paywallDesc = document.getElementById('paywall-feature-desc');
    
    if (paywallModal && paywallDesc) {
        paywallDesc.innerText = feature.desc;
        paywallModal.classList.remove('hidden-view');
        paywallModal.classList.add('active-view');
    }
    
    return true;
}

function updateSubscriptionUI() {
    const isPro = state.subscription !== 'free';
    
    // Pro badges
    const headerBadge = document.getElementById('header-pro-badge');
    const sidebarBadge = document.getElementById('pro-badge-container');
    const statusCard = document.getElementById('settings-subscription-status');
    const chartPaywall = document.getElementById('chart-paywall-overlay');
    const meditationPaywall = document.getElementById('meditation-paywall-overlay');
    
    if (headerBadge) {
        if (isPro) headerBadge.classList.remove('hidden-badge');
        else headerBadge.classList.add('hidden-badge');
    }
    
    if (sidebarBadge) {
        if (isPro) {
            sidebarBadge.className = "pro-badge-sidebar pro-tier";
            sidebarBadge.querySelector('.tier-label').innerHTML = `<i class="fa-solid fa-crown"></i> Pro Member`;
        } else {
            sidebarBadge.className = "pro-badge-sidebar free-tier";
            sidebarBadge.querySelector('.tier-label').innerText = "Free Account";
        }
    }
    
    if (statusCard) {
        if (isPro) {
            statusCard.className = "subscription-status-card pro";
            statusCard.querySelector('.status-title').innerHTML = `Current Plan: <strong>NoContact Pro (${state.subscription.toUpperCase()})</strong>`;
            statusCard.querySelector('.status-desc').innerText = "Thank you for supporting this application! You have unlocked all premium science-backed breakup recovery tools.";
        } else {
            statusCard.className = "subscription-status-card free";
            statusCard.querySelector('.status-title').innerHTML = `Current Plan: <strong>Free Tier</strong>`;
            statusCard.querySelector('.status-desc').innerText = "Upgrade to NoContact Pro to unlock guided meditations, daily check-ins, mood trend analytics, and unlimited AI Therapist support.";
        }
    }
    
    // Overlay paywalls
    if (chartPaywall) {
        if (isPro) chartPaywall.classList.add('hidden-paywall');
        else chartPaywall.classList.remove('hidden-paywall');
    }
    
    if (meditationPaywall) {
        if (isPro) meditationPaywall.classList.add('hidden-paywall');
        else meditationPaywall.classList.remove('hidden-paywall');
    }
}

// Generate random anonymous names for community posts
function generateAnonName() {
    const prefixes = ["Strong", "Healing", "Silent", "Peaceful", "Rising", "Rebuilding", "Brave", "Quiet"];
    const nouns = ["Soul", "Heart", "Healer", "Phoenix", "Warrior", "Spirit", "Mind", "Path"];
    const randomNum = Math.floor(Math.random() * 100);
    const p = prefixes[Math.floor(Math.random() * prefixes.length)];
    const n = nouns[Math.floor(Math.random() * nouns.length)];
    return `${p}${n}${randomNum}`;
}

// Format time difference
function formatTimeDiff(diffMs) {
    const seconds = Math.floor((diffMs / 1000) % 60);
    const minutes = Math.floor((diffMs / 1000 / 60) % 60);
    const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    return { days, hours, minutes, seconds };
}

// ==========================================================================
// CORE VIEW INITIALIZER & ROUTING
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    loadState();
    initApp();
    setupEventListeners();
});

function initApp() {
    if (state.hasStarted && state.startDate) {
        showView('main-app-view');
        initDashboard();
        startStreakTimer();
        initJournalTab();
        initCommunityTab();
        initPlanTab();
        updateAchievements();
    } else {
        showView('onboarding-view');
        initOnboardingForm();
    }
}

function showView(viewId) {
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active-view');
        view.classList.add('hidden-view');
    });
    const targetView = document.getElementById(viewId);
    targetView.classList.remove('hidden-view');
    targetView.classList.add('active-view');
}

// Nav Tab Routing
function setupTabRouting() {
    const navItems = document.querySelectorAll('.nav-item, .bottom-nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const tabName = item.getAttribute('data-tab');
            switchTab(tabName);
        });
    });
}

function switchTab(tabName) {
    // Update active tab buttons
    document.querySelectorAll('.nav-item, .bottom-nav-item').forEach(item => {
        if (item.getAttribute('data-tab') === tabName) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    // Update active tab contents
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active-tab');
        tab.classList.add('hidden-tab');
    });

    const targetTab = document.getElementById(`tab-${tabName}`);
    if (targetTab) {
        targetTab.classList.remove('hidden-tab');
        targetTab.classList.add('active-tab');
    }

    // Update header title
    const pageTitle = document.getElementById('page-title');
    if (pageTitle) {
        pageTitle.innerText = tabName.charAt(0).toUpperCase() + tabName.slice(1);
    }

    // Specific Tab Initializers
    if (tabName === 'dashboard') {
        initDashboard();
    } else if (tabName === 'journal') {
        renderJournalHistory();
    } else if (tabName === 'community') {
        renderCommunityPosts();
    } else if (tabName === 'plan') {
        renderPlanCalendar();
    }
}

// ==========================================================================
// ONBOARDING SCREEN LOGIC
// ==========================================================================
function initOnboardingForm() {
    const form = document.getElementById('onboarding-form');
    const chips = document.querySelectorAll('#reasons-chip-group .chip');
    const planCards = document.querySelectorAll('.plan-card');
    
    // Set default datetime picker to now
    const dateInput = document.getElementById('no-contact-date');
    const now = new Date();
    // Convert to local ISO format for input value
    const localISO = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    dateInput.value = localISO;
    dateInput.max = localISO; // Can't start No Contact in the future!

    // Handle Chip selection
    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            chip.classList.toggle('selected');
        });
    });

    // Handle Plan Cards selection
    planCards.forEach(card => {
        card.addEventListener('click', () => {
            planCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            state.selectedPlan = card.getAttribute('data-plan');
        });
    });

    // Handle form submit
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const exNameVal = document.getElementById('ex-name').value.trim();
        const dateVal = document.getElementById('no-contact-date').value;
        
        // Collect reasons
        const selectedReasons = [];
        document.querySelectorAll('#reasons-chip-group .chip.selected').forEach(chip => {
            selectedReasons.push(chip.getAttribute('data-value'));
        });

        // Set state
        state.hasStarted = true;
        state.exName = exNameVal || 'your ex';
        state.startDate = new Date(dateVal).getTime();
        state.reasons = selectedReasons.length > 0 ? selectedReasons : ["Self-Respect", "Healing"];
        state.completedTasks = [];
        state.temptationsDefeated = 0;
        state.journalEntries = [];
        state.userPosts = [];
        state.likedPosts = [];
        state.achievements = [];
        state.activeDaySelected = 1;

        saveState();
        initApp();
    });
}

// ==========================================================================
// DASHBOARD & STREAK TRACKING LOGIC
// ==========================================================================
let timerInterval = null;

function initDashboard() {
    // Greeting
    const greeting = document.getElementById('header-greeting');
    if (greeting) {
        greeting.innerText = state.exName ? `Stay strong for yourself, not ${state.exName}` : "Stay strong, Healer";
    }

    // Set start date text
    const sinceText = document.getElementById('streak-since-text');
    if (sinceText && state.startDate) {
        const d = new Date(state.startDate);
        sinceText.innerText = `Boundaries established: ${d.toLocaleDateString()} at ${d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
    }

    // Initialize/Refresh Affirmation
    displayAffirmation(false);

    // Initial calculation for streak updates
    updateStreakStats();
}

function startStreakTimer() {
    if (timerInterval) clearInterval(timerInterval);
    
    // Update every second
    timerInterval = setInterval(() => {
        updateStreakStats();
    }, 1000);
}

function updateStreakStats() {
    if (!state.startDate) return;

    const now = new Date().getTime();
    const diffMs = now - state.startDate;
    
    // Fallback if system time changed or onboarding future date bypassed
    if (diffMs < 0) {
        state.startDate = now;
        saveState();
        return;
    }

    const { days, hours, minutes, seconds } = formatTimeDiff(diffMs);

    // Update main counter numbers
    const dDays = document.getElementById('streak-days');
    const dDaysLabel = document.getElementById('streak-days-label');
    const dHours = document.getElementById('timer-hours');
    const dMinutes = document.getElementById('timer-minutes');
    const dSeconds = document.getElementById('timer-seconds');

    if (dDays) dDays.innerText = days;
    if (dDaysLabel) dDaysLabel.innerText = days === 1 ? "Day" : "Days";
    if (dHours) dHours.innerText = String(hours).padStart(2, '0');
    if (dMinutes) dMinutes.innerText = String(minutes).padStart(2, '0');
    if (dSeconds) dSeconds.innerText = String(seconds).padStart(2, '0');

    // Update circular progress bar
    updateCircularProgress(days);

    // Update healing phase stage
    updateRecoveryStage(days);

    // Update stats counters
    updateDashboardStats(days);
}

function updateCircularProgress(days) {
    const circle = document.getElementById('progress-ring-bar');
    if (!circle) return;

    const planDays = parseInt(state.selectedPlan) || 30;
    // Cap percentage at 100%
    const percentage = Math.min((days / planDays) * 100, 100) || 0.1; // Default slightly filled for visual design

    const radius = circle.r.baseVal.value;
    const circumference = radius * 2 * Math.PI; // approx 596.90
    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    
    const offset = circumference - (percentage / 100) * circumference;
    circle.style.strokeDashoffset = offset;
}

function updateRecoveryStage(days) {
    // Find current stage based on days
    const currentStage = STAGES.find(s => days >= s.minDays && days <= s.maxDays) || STAGES[STAGES.length - 1];

    const stageTag = document.getElementById('streak-stage-tag');
    const stageTitle = document.getElementById('stage-title');
    const stageDesc = document.getElementById('stage-desc');
    const stageProgressFill = document.getElementById('stage-progress-fill');
    const stageProgressRatio = document.getElementById('stage-progress-ratio');

    if (stageTag) stageTag.innerText = currentStage.title.split(' (')[0];
    if (stageTitle) stageTitle.innerText = currentStage.title;
    if (stageDesc) stageDesc.innerText = currentStage.desc;

    // Stage Progress Bar math
    if (stageProgressFill && stageProgressRatio) {
        const stageSpan = (currentStage.maxDays - currentStage.minDays) + 1;
        const stageProgress = (days - currentStage.minDays) + 1;
        
        let progressPercent = 0;
        let progressText = '';

        if (currentStage.maxDays > 1000) {
            // Infinite acceptance phase
            progressPercent = 100;
            progressText = `Ongoing peace reached! (${days} days strong)`;
        } else {
            progressPercent = Math.min((stageProgress / stageSpan) * 100, 100);
            progressText = `Day ${stageProgress} of ${stageSpan} in this phase`;
        }

        stageProgressFill.style.width = `${progressPercent}%`;
        stageProgressRatio.innerText = progressText;
    }
}

function updateDashboardStats(days) {
    // Healing rate formula = (Days Completed / Selected Plan) * 100 - with cap of 100%
    const planDays = parseInt(state.selectedPlan) || 30;
    const ratePercent = Math.min(Math.round((days / planDays) * 100), 100);

    const scoreNum = document.getElementById('healing-score-number');
    const sTemptations = document.getElementById('stats-temptations');
    const sJournals = document.getElementById('stats-journals');
    const sAchievements = document.getElementById('stats-achievements');

    if (scoreNum) scoreNum.innerText = `${ratePercent}%`;
    if (sTemptations) sTemptations.innerText = state.temptationsDefeated;
    if (sJournals) sJournals.innerText = state.journalEntries.length;
    
    // Unlock achievements count
    const totalAch = 8; // We have 8 achievements in total
    const unlockedCount = state.achievements.length;
    if (sAchievements) sAchievements.innerText = `${unlockedCount}/${totalAch}`;
}

function displayAffirmation(animate = true) {
    const box = document.getElementById('dashboard-affirmation');
    if (!box) return;

    // Pick random index
    const index = Math.floor(Math.random() * AFFIRMATIONS.length);
    const text = AFFIRMATIONS[index];

    if (animate) {
        box.classList.remove('animate-fade-in');
        // trigger reflow
        void box.offsetWidth;
        box.innerText = `"${text}"`;
        box.classList.add('animate-fade-in');
    } else {
        box.innerText = `"${text}"`;
    }
}

// ==========================================================================
// TEMPTATION MODE / EMERGENCY SHIELD LOGIC
// ==========================================================================
// ==========================================================================
// TEMPTATION MODE / EMERGENCY SHIELD LOGIC
// ==========================================================================
let breathingInterval = null;
let cooldownInterval = null;
let cooldownTimeLeft = 300; // 5 minutes in seconds
let activeQuizQuestionIdx = 1;
let quizScore = 0; // Total clown rating

function openTemptationMode() {
    const view = document.getElementById('temptation-view');
    view.classList.remove('hidden-view');
    view.classList.add('active-view');

    // Reset stages
    document.getElementById('temptation-quiz-stage').classList.remove('hidden-view');
    document.getElementById('temptation-quiz-stage').classList.add('active-view');
    document.getElementById('temptation-shield-stage').classList.add('hidden-view');
    document.getElementById('temptation-shield-stage').classList.remove('temptation-grid'); // remove grid structure when hidden
    
    // Reset quiz questions UI
    activeQuizQuestionIdx = 1;
    quizScore = 0;
    
    const questions = document.querySelectorAll('.quiz-question-item');
    questions.forEach(q => {
        const qNum = parseInt(q.getAttribute('data-q'));
        if (qNum === 1) {
            q.classList.add('active');
        } else {
            q.classList.remove('active');
        }
    });

    document.querySelector('.quiz-questions-list').classList.remove('hidden-view');
    document.getElementById('quiz-results').classList.add('hidden-view');

    // Reset unsent text area
    document.getElementById('unsent-message-input').value = '';

    // Initialize breathing cycle
    startBreathingAnimation();

    // Initialize cooldown timer
    startUrgeCooldown();

    // Setup quiz event binds
    initTemptationQuiz();
}

function initTemptationQuiz() {
    const ansButtons = document.querySelectorAll('.quiz-ans-btn');
    
    // Clear and re-bind listeners
    ansButtons.forEach(btn => {
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        
        newBtn.addEventListener('click', () => {
            const val = newBtn.getAttribute('data-val');
            
            // Score weight: 'yes' options are clown points
            if (val === 'yes') {
                if (activeQuizQuestionIdx === 3) quizScore += 34;
                else quizScore += 33;
            }

            // Move to next question
            const currentQ = document.querySelector(`.quiz-question-item[data-q="${activeQuizQuestionIdx}"]`);
            if (currentQ) currentQ.classList.remove('active');

            activeQuizQuestionIdx++;
            
            const nextQ = document.querySelector(`.quiz-question-item[data-q="${activeQuizQuestionIdx}"]`);
            if (nextQ) {
                nextQ.classList.add('active');
            } else {
                // Quiz complete, show results
                showQuizResults();
            }
        });
    });

    // Proceed to shield button
    const proceedBtn = document.getElementById('btn-proceed-shield');
    if (proceedBtn) {
        const newBtn = proceedBtn.cloneNode(true);
        proceedBtn.parentNode.replaceChild(newBtn, proceedBtn);
        newBtn.addEventListener('click', () => {
            document.getElementById('temptation-quiz-stage').classList.add('hidden-view');
            document.getElementById('temptation-quiz-stage').classList.remove('active-view');
            
            const shieldGrid = document.getElementById('temptation-shield-stage');
            shieldGrid.classList.remove('hidden-view');
            shieldGrid.classList.add('temptation-grid'); // restore grid layout

            // Render temptation reasons why
            renderTemptationWhys();
        });
    }

    // Abort button
    const abortBtn = document.getElementById('btn-abort-temptation');
    if (abortBtn) {
        const newBtn = abortBtn.cloneNode(true);
        abortBtn.parentNode.replaceChild(newBtn, abortBtn);
        newBtn.addEventListener('click', closeTemptationMode);
    }
}

function showQuizResults() {
    document.querySelector('.quiz-questions-list').classList.add('hidden-view');
    const resultsPanel = document.getElementById('quiz-results');
    resultsPanel.classList.remove('hidden-view');

    const emoji = document.getElementById('results-emoji');
    const title = document.getElementById('results-title');
    const desc = document.getElementById('results-desc');

    title.innerText = `DELUSIONAL LEVEL: ${quizScore}%`;

    if (quizScore === 0) {
        emoji.innerText = '👑';
        desc.innerText = `Clean slate bestie! 0% delusion detected. Your self-respect boundaries are rock solid. If you are still feeling slight anxiety, write an unsent message in our shield anyway to completely release the weight.`;
    } else if (quizScore === 100) {
        emoji.innerText = '🤡';
        desc.innerText = `Bestie, you are literally about to text ${state.exName || 'your ex'} with 100% pure delusion. Put the clown nose down. Enter our emergency shield below and burn that draft immediately!`;
    } else {
        emoji.innerText = '⚠️';
        desc.innerText = `Clown level warning: ${quizScore}% delusion. You are starting to waver. Protect your peace and enter the temptation shield below to get those feelings out without relapsing.`;
    }
}

function closeTemptationMode() {
    const view = document.getElementById('temptation-view');
    view.classList.remove('active-view');
    view.classList.add('hidden-view');

    // Clean up intervals
    if (breathingInterval) clearInterval(breathingInterval);
    if (cooldownInterval) clearInterval(cooldownInterval);
}

function renderTemptationWhys() {
    const container = document.getElementById('temptation-whys-list');
    if (!container) return;

    container.innerHTML = '';
    state.reasons.forEach(reason => {
        const li = document.createElement('li');
        li.innerHTML = `<i class="fa-solid fa-circle-exclamation text-danger"></i> To focus on my ${reason.toLowerCase()}`;
        container.appendChild(li);
    });
}

function startBreathingAnimation() {
    const circle = document.getElementById('breathing-circle');
    const text = document.getElementById('breathing-text');
    if (!circle || !text) return;

    if (breathingInterval) clearInterval(breathingInterval);

    let step = 0; // 0: Inhale, 1: Hold, 2: Exhale

    const runStep = () => {
        if (step === 0) {
            circle.className = 'breathing-circle inhale';
            text.innerText = 'Inhale...';
            step = 1;
        } else if (step === 1) {
            circle.className = 'breathing-circle hold';
            text.innerText = 'Hold...';
            step = 2;
        } else {
            circle.className = 'breathing-circle exhale';
            text.innerText = 'Exhale...';
            step = 0;
        }
    };

    runStep();
    breathingInterval = setInterval(runStep, 5000);
}

function startUrgeCooldown() {
    const timerText = document.getElementById('cooldown-timer');
    if (!timerText) return;

    if (cooldownInterval) clearInterval(cooldownInterval);

    cooldownTimeLeft = 300; // Reset to 5 mins

    const formatTimer = (sec) => {
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };

    timerText.innerText = formatTimer(cooldownTimeLeft);

    cooldownInterval = setInterval(() => {
        cooldownTimeLeft--;
        timerText.innerText = formatTimer(cooldownTimeLeft);

        if (cooldownTimeLeft <= 0) {
            clearInterval(cooldownInterval);
            timerText.innerText = "Urge Defeated!";
            timerText.style.color = "var(--success-light)";
        }
    }, 1000);
}

function burnUnsentMessage() {
    const textarea = document.getElementById('unsent-message-input');
    const message = textarea.value.trim();

    if (!message) {
        showToast("Empty Message 🤡", "Please write down your feelings before burning the message.", "warning");
        return;
    }

    state.temptationsDefeated++;
    saveState();
    updateAchievements();

    // Trigger visual burn simulation
    textarea.style.transition = 'all 1s ease-out';
    textarea.style.transform = 'scale(0.8) rotate(3deg)';
    textarea.style.opacity = '0';
    textarea.style.filter = 'blur(10px) brightness(3)';

    setTimeout(() => {
        showToast("Evidence Burnt 🔥", "Your unsent message has been incinerated and released. Cravings dismissed!", "success");
        textarea.value = '';
        textarea.style.transform = 'scale(1) rotate(0deg)';
        textarea.style.opacity = '1';
        textarea.style.filter = 'none';
        closeTemptationMode();
        switchTab('dashboard');
        
        playCalmingChime();
    }, 1200);
}

// ==========================================================================
// AI THERAPIST CHAT LOGIC
// ==========================================================================
let activeChatSessionMessages = []; // Session history memory for OpenAI completions

function initChatSubmit() {
    const form = document.getElementById('chat-input-form');
    const input = document.getElementById('chat-user-message');
    const vibeButtons = document.querySelectorAll('.vibe-btn');
    
    if (form && input) {
        // Clear previous event listeners by cloning
        const newForm = form.cloneNode(true);
        form.parentNode.replaceChild(newForm, form);
        
        newForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const msg = document.getElementById('chat-user-message').value.trim();
            if (!msg) return;

            handleUserChatMessage(msg);
            document.getElementById('chat-user-message').value = '';
        });
    }

    // Bind suggestion pills
    document.querySelectorAll('.suggestion-pill').forEach(pill => {
        const newPill = pill.cloneNode(true);
        pill.parentNode.replaceChild(newPill, pill);
        newPill.addEventListener('click', () => {
            const text = newPill.innerText.replace(/^[^\w]*/, '').trim(); // Strip emojis from front
            handleUserChatMessage(text);
        });
    });

    // Vibe Segment buttons bind
    vibeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            if (requiresPro('therapist')) return;

            vibeButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const vibe = btn.getAttribute('data-vibe');
            state.coachVibe = vibe;
            saveState();

            // Refresh UI details and post new welcome greeting
            updateTherapistHeaderVibe();
            postCoachGreeting();
        });
    });

    // Enforce active Vibe visual button states on load
    if (vibeButtons.length > 0) {
        vibeButtons.forEach(b => {
            if (b.getAttribute('data-vibe') === state.coachVibe) {
                b.classList.add('active');
            } else {
                b.classList.remove('active');
            }
        });
    }
    
    updateTherapistHeaderVibe();
}

function updateTherapistHeaderVibe() {
    const title = document.getElementById('therapist-name-display');
    const desc = document.getElementById('therapist-desc-display');
    if (!title || !desc) return;

    if (state.coachVibe === 'baddie') {
        title.innerHTML = 'Baddie Bestie Coach 💅';
        desc.innerText = 'Hype-person & supportive bestie telling you what you need to hear';
    } else if (state.coachVibe === 'savage') {
        title.innerHTML = 'Savage Reality Roast 💀';
        desc.innerText = 'No-nonsense boundaries coach giving you a direct reality check';
    } else {
        title.innerHTML = 'Scientific Tea Therapist 🧠';
        desc.innerText = 'Compassionate, clinical psychology & relationship neuroscience guide';
    }
}

function postCoachGreeting() {
    const container = document.getElementById('chat-messages');
    if (!container) return;

    container.innerHTML = '';
    activeChatSessionMessages = [];

    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble therapist-bubble';

    let msg = '';
    if (state.coachVibe === 'baddie') {
        msg = `Hey bestie! ✨ I'm here to remind you that your energy is way too premium to fold for some mid clown. 💅 No Contact is the ultimate glow-up power move. Spill the tea, how are we holding up today?`;
    } else if (state.coachVibe === 'savage') {
        msg = `So you entered the Savage Era. 💀 Good. Let's make sure you don't drop your crown in the dirt. I'm here to give you the raw reality check you need. Tell me what's tempting you, and let's get you unclowned.`;
    } else {
        msg = `Welcome back. 🧠 I'm here to share the clinical psychology and neurobiological science of why heartbreak feels like physical withdrawal. Maintaining boundaries is how your brain heals. How are you feeling today?`;
    }

    bubble.innerHTML = `<p>${msg}</p><span class="chat-time">Just now</span>`;
    container.appendChild(bubble);
    scrollToBottom(container);
}

function handleUserChatMessage(text) {
    if (requiresPro('therapist')) return;

    const container = document.getElementById('chat-messages');
    if (!container) return;

    // 1. User Bubble
    const userBubble = document.createElement('div');
    userBubble.className = 'chat-bubble user-bubble';
    userBubble.innerHTML = `<p>${escapeHTML(text)}</p><span class="chat-time">Just now</span>`;
    container.appendChild(userBubble);
    scrollToBottom(container);

    // Save to journal logs for Pro message rate tracking
    const todayStr = new Date().toISOString().slice(0, 10);
    state.journalEntries.push({
        id: Date.now(),
        type: 'chat_user_msg',
        dateStr: todayStr,
        content: text
    });
    saveState();

    // 2. Typing Bubble
    const typingBubble = document.createElement('div');
    typingBubble.className = 'chat-bubble therapist-bubble typing-bubble';
    typingBubble.innerHTML = `<p><i class="fa-solid fa-circle-notch fa-spin"></i> Coach is processing...</p>`;
    
    setTimeout(() => {
        container.appendChild(typingBubble);
        scrollToBottom(container);
    }, 300);

    // Append to message completion records
    activeChatSessionMessages.push({ role: "user", content: text });

    // Limit active memory size
    if (activeChatSessionMessages.length > 8) {
        activeChatSessionMessages.shift();
    }

    // 3. Dispatch Responses
    const useOpenAI = state.openAiApiKey && state.openAiApiKey.startsWith('sk-');
    const usePuter = typeof puter !== 'undefined' && puter.ai;
    
    if (useOpenAI) {
        fetchOpenAiCompletion(text, typingBubble, container);
    } else if (usePuter) {
        fetchPuterAiCompletion(text, typingBubble, container);
    } else {
        setTimeout(() => {
            typingBubble.remove();
            const replyText = getTherapistResponse(text);
            
            // Push response to session history
            activeChatSessionMessages.push({ role: "assistant", content: replyText });
            if (activeChatSessionMessages.length > 8) activeChatSessionMessages.shift();

            renderTypingEffect(replyText, container);
        }, 1200);
    }
}

async function fetchOpenAiCompletion(userText, typingBubble, container) {
    // Calculate boundaries days
    const now = new Date().getTime();
    const diffMs = now - (state.startDate || now);
    const days = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));

    // Select dynamic system prompt based on vibe state
    let personaPrompt = '';
    if (state.coachVibe === 'baddie') {
        personaPrompt = `You are a "Baddie Bestie Breakup Coach" 💅. You speak in heavy Gen Z slang (slay, bestie, mid, premium energy, main character glow-up, rent-free, clown behavior, folding, tea). Be highly supportive, energetic, and roast their ex (named "${state.exName}") as basic/mid. Remind them that breaking No Contact is clown behavior. Encourage them to stay strong on Day ${days} of their No Contact Era.`;
    } else if (state.coachVibe === 'savage') {
        personaPrompt = `You are a "Savage Reality Check Coach" 💀. You tell the user raw, brutal truths. Do not sugarcoat anything. Tell them they are acting delusional if they want to text their ex "${state.exName}". Use blunt roasts ("your crown is in the mud", "put the clown nose down"). Remind them that they are Option C. Highlight that on Day ${days} of No Contact, folding is embarrassing.`;
    } else {
        personaPrompt = `You are a "Scientific Tea Breakup Coach" 🧠. Your tone is clinical yet compassionate. Explain their heartbreak using psychological science (e.g., dopamine withdrawal loops, attachment theory styles, vagus nerve regulation, cortisol stress, neural pathway re-wiring). Encourage them to remain strong on Day ${days} of No Contact. Highlight the science of boundaries.`;
    }

    const systemMessage = {
        role: "system",
        content: `${personaPrompt} 
        The user is following a ${state.selectedPlan}-day healing plan. 
        Rules: Keep answers concise (under 3 paragraphs). Use visual bullet points, line breaks, and emojis. Never speak robotically. Suggest app features like "Temptation Shield" (to burn letters) or "My Era Logs" (journals) if relevant.`
    };

    // Prepare full messages payload
    const messages = [systemMessage, ...activeChatSessionMessages];

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${state.openAiApiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: messages,
                temperature: 0.8,
                max_tokens: 280
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP Error Status: ${response.status}`);
        }

        const data = await response.json();
        const replyText = data.choices[0].message.content.trim();

        typingBubble.remove();
        
        // Save reply to memory
        activeChatSessionMessages.push({ role: "assistant", content: replyText });
        if (activeChatSessionMessages.length > 8) activeChatSessionMessages.shift();

        renderTypingEffect(replyText, container);

    } catch (error) {
        console.error("OpenAI completions request failed, falling back to simulated engine.", error);
        
        // Trigger Toast Warning Alert
        showToast("OpenAI Sync Issue 🔌", "We couldn't connect to OpenAI. Dropping back to your offline simulated coach vibe.", "warning");

        // Execute Simulated Fallback
        typingBubble.remove();
        const fallbackText = getTherapistResponse(userText);
        
        activeChatSessionMessages.push({ role: "assistant", content: fallbackText });
        if (activeChatSessionMessages.length > 8) activeChatSessionMessages.shift();

        renderTypingEffect(fallbackText, container);
    }
}

async function fetchPuterAiCompletion(userText, typingBubble, container) {
    // Calculate boundaries days
    const now = new Date().getTime();
    const diffMs = now - (state.startDate || now);
    const days = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));

    // Select dynamic system prompt based on vibe state
    let personaPrompt = '';
    if (state.coachVibe === 'baddie') {
        personaPrompt = `You are a "Baddie Bestie Breakup Coach" 💅. You speak in heavy Gen Z slang (slay, bestie, mid, premium energy, main character glow-up, rent-free, clown behavior, folding, tea). Be highly supportive, energetic, and roast their ex (named "${state.exName}") as basic/mid. Remind them that breaking No Contact is clown behavior. Encourage them to stay strong on Day ${days} of their No Contact Era.`;
    } else if (state.coachVibe === 'savage') {
        personaPrompt = `You are a "Savage Reality Check Coach" 💀. You tell the user raw, brutal truths. Do not sugarcoat anything. Tell them they are acting delusional if they want to text their ex "${state.exName}". Use blunt roasts ("your crown is in the mud", "put the clown nose down"). Remind them that they are Option C. Highlight that on Day ${days} of No Contact, folding is embarrassing.`;
    } else {
        personaPrompt = `You are a "Scientific Tea Breakup Coach" 🧠. Your tone is clinical yet compassionate. Explain their heartbreak using psychological science (e.g., dopamine withdrawal loops, attachment theory styles, vagus nerve regulation, cortisol stress, neural pathway re-wiring). Encourage them to remain strong on Day ${days} of No Contact. Highlight the science of boundaries.`;
    }

    const systemPrompt = `${personaPrompt} 
    The user is following a ${state.selectedPlan}-day healing plan. 
    Rules: Keep answers concise (under 3 paragraphs). Use visual bullet points, line breaks, and emojis. Never speak robotically. Suggest app features like "Temptation Shield" (to burn letters) or "My Era Logs" (journals) if relevant.`;

    const messages = [
        { role: "system", content: systemPrompt },
        ...activeChatSessionMessages
    ];

    try {
        const response = await puter.ai.chat(messages, {
            model: 'gpt-4o-mini'
        });

        let replyText = '';
        if (response && response.message && response.message.content) {
            replyText = response.message.content.trim();
        } else if (typeof response === 'string') {
            replyText = response.trim();
        } else {
            throw new Error("Invalid response from Puter AI");
        }

        typingBubble.remove();

        // Save reply to memory
        activeChatSessionMessages.push({ role: "assistant", content: replyText });
        if (activeChatSessionMessages.length > 8) activeChatSessionMessages.shift();

        renderTypingEffect(replyText, container);

    } catch (error) {
        console.error("Puter completions request failed, falling back to simulated engine.", error);

        // Fallback to Simulated Heuristics
        typingBubble.remove();
        const fallbackText = getTherapistResponse(userText);

        activeChatSessionMessages.push({ role: "assistant", content: fallbackText });
        if (activeChatSessionMessages.length > 8) activeChatSessionMessages.shift();

        renderTypingEffect(fallbackText, container);
    }
}

function renderTypingEffect(fullText, container) {
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble therapist-bubble';
    
    // Create text element container to typing segments inside
    const p = document.createElement('p');
    bubble.appendChild(p);
    
    const timeSpan = document.createElement('span');
    timeSpan.className = 'chat-time';
    timeSpan.innerText = 'Just now';
    bubble.appendChild(timeSpan);
    
    container.appendChild(bubble);
    scrollToBottom(container);

    let charIdx = 0;
    const speed = 12; // speed in milliseconds
    
    const runTyping = () => {
        if (charIdx < fullText.length) {
            const nextChar = fullText.charAt(charIdx);
            
            // Allow basic tags like <strong> and <br>
            if (nextChar === '<') {
                const tagEnd = fullText.indexOf('>', charIdx);
                if (tagEnd !== -1) {
                    p.innerHTML += fullText.substring(charIdx, tagEnd + 1);
                    charIdx = tagEnd + 1;
                } else {
                    p.innerHTML += nextChar;
                    charIdx++;
                }
            } else {
                p.innerHTML += nextChar;
                charIdx++;
            }
            
            scrollToBottom(container);
            setTimeout(runTyping, speed);
        }
    };
    runTyping();
}

function getTherapistResponse(text) {
    const lower = text.toLowerCase();
    const ex = state.exName || 'your ex';
    const vibe = state.coachVibe || 'scientific';

    // Calculate boundaries days
    const now = new Date().getTime();
    const diffMs = now - (state.startDate || now);
    const days = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));

    if (vibe === 'baddie') {
        // Physical activities
        if (lower.includes('walk') || lower.includes('run') || lower.includes('gym') || lower.includes('workout') || lower.includes('exercise')) {
            return `Slay bestie! 🏃‍♀️ Getting moving (gym, walks, workouts) is literally a 10/10 way to flush out those nasty stress hormones and distance yourself from ${ex}'s toxic energy. You are on Day ${days} of your glow-up era, and building that main character energy. Proud of you!`;
        }
        // Stalking / social media
        if (lower.includes('stalk') || lower.includes('instagram') || lower.includes('tiktok') || lower.includes('check') || lower.includes('social media')) {
            return `Stop right there, bestie! 🚨 Checking ${ex}'s Instagram/TikTok is literal digital self-harm. You are on Day ${days} of No Contact—do not let a 2-second peek reset your gorgeous streak. Close the app and go do some skincare immediately. 💅`;
        }
        // Music / Songs
        if (lower.includes('song') || lower.includes('music') || lower.includes('playlist')) {
            return `Bestie, music is powerful, but if you are listening to sad breakup tracks, you are manifesting clown energy. 🤡 Switch to our high-energy 'No-Breakup' playlist or some upbeat bops. You deserve premium vibes only!`;
        }
        // Dreams / Sleep
        if (lower.includes('dream') || lower.includes('sleep') || lower.includes('nightmare')) {
            return `Ugh, dreams are the worst because ${ex} is showing up rent-free in your subconscious. 😤 It's just your brain cleaning house while you sleep. Keep sticking to your routines on Day ${days}; your dreams will clear out soon, I promise!`;
        }
        // Drunk / Alcohol
        if (lower.includes('drunk') || lower.includes('drink') || lower.includes('beer') || lower.includes('wine') || lower.includes('alcohol')) {
            return `Emergency bestie warning! 🚨 Lowered inhibitions + heartbreak = a recipe for folding and texting ${ex}. If you are out drinking, hand your phone to a trusted friend or activate our <strong>Temptation Shield</strong> immediately! Protect your streak!`;
        }
        // Friends / Family
        if (lower.includes('friend') || lower.includes('family') || lower.includes('mom') || lower.includes('dad') || lower.includes('sister')) {
            return `Obsessed with this for you! 💖 Leaning on your besties or family is exactly how you rebuild. You are not in this alone, and sharing your journey makes Day ${days} so much easier to get through.`;
        }
        // Standard text/contact
        if (lower.includes('text') || lower.includes('contact') || lower.includes('call') || lower.includes('reach out') || lower.includes('message')) {
            return `Bestie, PUT THE PHONE DOWN. 🤡 Texting ${ex} is absolute clown behavior. They are literally mid and you are a whole premium subscription membership. Open our <strong>Temptation Shield</strong> at the top right, write that message, and burn it to ashes right now. 💅`;
        }
        // Why is it hard
        if (lower.includes('why') && (lower.includes('hard') || lower.includes('difficult') || lower.includes('painful') || lower.includes('hurt'))) {
            return `It hurts because your brain is literally detoxing from their presence, bestie. Reclaiming your main character energy on Day ${days} takes actual work! Drink some water, do a skincare routine, and remind yourself that you are the absolute prize. 👑`;
        }
        // Missing them
        if (lower.includes('miss') || lower.includes('memory') || lower.includes('remember')) {
            return `Missing them? Delusional bestie alert! 🚨 Your brain is filtering out the bad times and romanticizing the bare minimum they gave you. Focus on your own glow-up era on Day ${days} and let them watch you thrive from the blocks. 💅`;
        }
        // Anger
        if (lower.includes('angry') || lower.includes('hate') || lower.includes('unfair') || lower.includes('mad')) {
            return `Channel that anger! 😡 That's your self-respect waking up and realizing ${ex} didn't deserve your premium vibe anyway. Block their details, maintain silence on Day ${days}, and let your glow-up do the talking. 🚫`;
        }
        // Sadness
        if (lower.includes('sad') || lower.includes('cry') || lower.includes('lonely') || lower.includes('depressed') || lower.includes('tear')) {
            return `Screaming, crying, throwing up is a valid phase, bestie. Let the tears fall, but remember: you aren't lonely, you're just adjusting to absolute peace. Go wrap yourself in a blanket and eat comfort foods. 💖`;
        }
        // Default
        return `I hear you, bestie. Your energy is too premium for that situation. Since we are on Day ${days} of your No Contact Era, what is one small thing we can do today to focus on our own glow-up? ✨`;
    }

    if (vibe === 'savage') {
        // Physical activities
        if (lower.includes('walk') || lower.includes('run') || lower.includes('gym') || lower.includes('workout') || lower.includes('exercise')) {
            return `Good. Using your body (gym, walking, workouts) is the only smart thing you've done today. 💀 Sweating burns off the delusional hope of contacting ${ex}. Keep moving and stay strong on Day ${days} of No Contact.`;
        }
        // Stalking / social media
        if (lower.includes('stalk') || lower.includes('instagram') || lower.includes('tiktok') || lower.includes('check') || lower.includes('social media')) {
            return `What are you looking for on ${ex}'s profile? A sign they miss you? Let me save you the time: they don't. 💀 Checking their updates is embarrassing. Put the phone down, lock your profile, and act like you have some pride on Day ${days}.`;
        }
        // Music / Songs
        if (lower.includes('song') || lower.includes('music') || lower.includes('playlist')) {
            return `Let me guess, listening to sad love songs and staring at the ceiling? 💀 Stop feeding your own heartbreak loop. Listen to something that makes you want to build a business, not cry over a basic ex.`;
        }
        // Dreams / Sleep
        if (lower.includes('dream') || lower.includes('sleep') || lower.includes('nightmare')) {
            return `So ${ex} is haunting your dreams. Big deal. Your brain is just cleaning out toxic waste while you sleep. Don't let a random REM cycle make you act delusional during the day. Lock back in for Day ${days}.`;
        }
        // Drunk / Alcohol
        if (lower.includes('drunk') || lower.includes('drink') || lower.includes('beer') || lower.includes('wine') || lower.includes('alcohol')) {
            return `If you text ${ex} while drunk, you are officially signing up for 100% pure humiliation. 🤡 Turn off your phone or delete their number before you wake up tomorrow regretting everything. Protect your Day ${days} streak.`;
        }
        // Friends / Family
        if (lower.includes('friend') || lower.includes('family') || lower.includes('mom') || lower.includes('dad') || lower.includes('sister')) {
            return `Good. Listen to your friends and family because they are the ones who have to listen to you talk about ${ex} all day. They want you to move on. Stay strong for them, and for yourself.`;
        }
        // Standard text/contact
        if (lower.includes('text') || lower.includes('contact') || lower.includes('call') || lower.includes('reach out') || lower.includes('message')) {
            return `You want to text ${ex}? Did you drop your crown in the toilet or what? 🤡 They literally treated you like Option C. Stop embarrassing yourself. Open our <strong>Temptation Shield</strong> right now, type the draft, and burn it. Do not hit send. 💀`;
        }
        // Why is it hard
        if (lower.includes('why') && (lower.includes('hard') || lower.includes('difficult') || lower.includes('painful') || lower.includes('hurt'))) {
            return `It's painful because you got addicted to mistreatment. Your brain is having severe chemical withdrawal from toxic relationship loops. Sit with the empty silence on Day ${days}. Reclaiming your self-respect is not supposed to feel like a spa day. 💀`;
        }
        // Missing them
        if (lower.includes('miss') || lower.includes('memory') || lower.includes('remember')) {
            return `You don't miss them. You miss the fake fantasy version of them you made up in your head. The actual version of ${ex} was inconsistent and basic. Stop romanticizing garbage. 🔒`;
        }
        // Anger
        if (lower.includes('angry') || lower.includes('hate') || lower.includes('unfair') || lower.includes('mad')) {
            return `Anger is fine, but using it to message them is weak. Your absolute silence on Day ${days} is the only closure they deserve. Keep them blocked and channel that energy into your own bank account. 📈`;
        }
        // Sadness
        if (lower.includes('sad') || lower.includes('cry') || lower.includes('lonely') || lower.includes('depressed') || lower.includes('tear')) {
            return `Cry it out, but don't fold. Loneliness is just the chemical price you pay for clearing out the trash on Day ${days}. Stand tall and let the silence heal you. 💀`;
        }
        // Default
        return `That's a lot of text for 'I'm thinking about folding.' You are on Day ${days} of No Contact. You are stronger than a chemical urge. Lock in, focus, and protect your boundaries. 💀`;
    }

    // Default 'scientific' vibe
    // Physical activities
    if (lower.includes('walk') || lower.includes('run') || lower.includes('gym') || lower.includes('workout') || lower.includes('exercise')) {
        return `Engaging in physical activity like a walk or workout triggers the release of endorphins while metabolizing excess cortisol and adrenaline. It is a scientifically proven way to calm your amygdala's 'fight-or-flight' stress alarm. You are supporting your neurobiological recovery on Day ${days} of No Contact. Keep it up!`;
    }
    // Stalking / social media
    if (lower.includes('stalk') || lower.includes('instagram') || lower.includes('tiktok') || lower.includes('check') || lower.includes('social media')) {
        return `Looking at ${ex}'s social media triggers a brief spike of dopamine in your reward pathway, followed by an immediate drop that reinforces attachment anxiety. It acts similarly to drug seeking in addiction studies. On Day ${days}, maintaining total visual boundaries is essential to allow your neural pathways to rewire.`;
    }
    // Music / Songs
    if (lower.includes('song') || lower.includes('music') || lower.includes('playlist')) {
        return `Auditory triggers (songs) are highly linked to memory structures in the hippocampus. If you listen to nostalgic music, you trigger cravings. Consider switching to upbeat or instrumental tracks to stimulate your brain's motor networks rather than emotional memories.`;
    }
    // Dreams / Sleep
    if (lower.includes('dream') || lower.includes('sleep') || lower.includes('nightmare')) {
        return `During REM sleep, your brain consolidates emotional memories, which often causes ${ex} to appear in your dreams. This is a standard cognitive processing phase. While unsettling on Day ${days}, it is a sign that your brain is actively working to catalog and file away past attachments.`;
    }
    // Drunk / Alcohol
    if (lower.includes('drunk') || lower.includes('drink') || lower.includes('beer') || lower.includes('wine') || lower.includes('alcohol')) {
        return `Alcohol consumption depresses the prefrontal cortex, which is responsible for executive function, impulse control, and boundary preservation. This significantly increases your vulnerability to breaking No Contact. If you drink, ensure you have safeguards in place to protect your Day ${days} recovery.`;
    }
    // Friends / Family
    if (lower.includes('friend') || lower.includes('family') || lower.includes('mom') || lower.includes('dad') || lower.includes('sister')) {
        return `Social support activates the release of oxytocin, which naturally buffers cortisol (stress) levels and stimulates feelings of safety. Discussing your feelings on Day ${days} with a trusted social network is highly recommended for emotional regulation.`;
    }
    // Standard text/contact
    if (lower.includes('text') || lower.includes('contact') || lower.includes('call') || lower.includes('reach out') || lower.includes('message')) {
        return `It is completely natural to want to text ${ex}. When we break contact, our brain craves dopamine. Remember, texting them won't bring you the closure you want; it will only open old wounds. Take a deep breath. Can you go 10 minutes without hitting send? Open our <strong>Temptation Shield</strong> at the top right to burn the message instead.`;
    }
    // Why is it hard
    if (lower.includes('why') && (lower.includes('hard') || lower.includes('difficult') || lower.includes('painful') || lower.includes('hurt'))) {
        return `No Contact is incredibly hard because it's a form of physiological detox. Your brain is trying to rewire itself on Day ${days} after being accustomed to attachment patterns. Rebuilding this self-concept takes time. Be gentle with your body right now. Drink some water and give yourself credit for standing strong.`;
    }
    // Missing them
    if (lower.includes('miss') || lower.includes('memory') || lower.includes('remember')) {
        return `Missing them is a reflection of your capacity to love, not a sign that you made the wrong decision. Your brain tends to filter out the bad memories and glorify the good ones during breakups. Reflect on your onboarding list: 'Why did we separate?' Your growth on Day ${days} depends on looking forward, not backwards.`;
    }
    // Anger
    if (lower.includes('angry') || lower.includes('hate') || lower.includes('unfair') || lower.includes('mad')) {
        return `I hear your anger, and it is fully justified. Anger is actually a healthy sign that your self-protective boundaries are waking up. It means you recognize you deserved better. Let yourself feel the anger, write it down in your <strong>Journal</strong> to get it out of your system, but don't act on it by lashing out at ${ex}. Your silence on Day ${days} is your ultimate power.`;
    }
    // Sadness
    if (lower.includes('sad') || lower.includes('cry') || lower.includes('lonely') || lower.includes('depressed') || lower.includes('tear')) {
        return `Grief is the price we pay for caring. It is completely okay to cry and feel lonely right now. Healing is not linear—some days will feel like a regression. Reach out to a close friend, take a hot shower, and remember: you are not lonely; you are just in the process of returning to yourself.`;
    }

    return `Thank you for sharing that with me. It takes real courage to express these thoughts. Every day you maintain No Contact, you are reclaiming a piece of your peace and self-worth. Since we are on Day ${days}, what is one small thing you can do for yourself today to feel comfortable?`;
}

function scrollToBottom(element) {
    element.scrollTop = element.scrollHeight;
}

function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
}

// ==========================================================================
// TAB 3: JOURNALING LOGIC
// ==========================================================================
let selectedMood = '';

function initJournalTab() {
    const moodBtns = document.querySelectorAll('.mood-btn');
    const form = document.getElementById('journal-form');
    
    moodBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            moodBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedMood = btn.getAttribute('data-mood');
        });
    });

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const textVal = document.getElementById('journal-note').value.trim();
            if (!textVal) return;

            if (!selectedMood) {
                showToast("Mood Required 😭", "Please select an emoji representing your current era.", "warning");
                return;
            }

            const entry = {
                id: Date.now(),
                date: new Date().getTime(),
                mood: selectedMood,
                content: textVal
            };

            state.journalEntries.unshift(entry); // New entries first
            saveState();
            updateAchievements();

            // Reset form
            form.reset();
            moodBtns.forEach(b => b.classList.remove('active'));
            selectedMood = '';

            renderJournalHistory();
            showToast("Era Logged ✨", "Your rant has been successfully saved to your healing timeline. Stay strong bestie!", "success");
        });
    }

    // Search bar event
    const searchInput = document.getElementById('journal-search');
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            renderJournalHistory(searchInput.value.trim());
        });
    }
}

function getMoodEmoji(mood) {
    const moodMap = {
        sad: '😢',
        anxious: '😰',
        angry: '😡',
        peaceful: '🧘',
        hopeful: '✨'
    };
    return moodMap[mood] || '📝';
}

function renderJournalHistory(filterText = '') {
    const container = document.getElementById('journal-entries-container');
    if (!container) return;

    container.innerHTML = '';

    const entries = filterText 
        ? state.journalEntries.filter(e => e.content.toLowerCase().includes(filterText.toLowerCase()))
        : state.journalEntries;

    if (entries.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fa-solid fa-pen-nib"></i>
                <p>${filterText ? "No logs match your search terms." : "You haven't written any journal logs yet. Expressing your feelings is a verified way to release pain. Write your first log today!"}</p>
            </div>
        `;
        return;
    }

    entries.forEach(entry => {
        const item = document.createElement('div');
        item.className = 'journal-item';
        
        const d = new Date(entry.date);
        const formattedDate = `${d.toLocaleDateString()} at ${d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;

        item.innerHTML = `
            <div class="journal-item-header">
                <div class="journal-meta">
                    <span class="journal-mood-badge" title="${entry.mood}">${getMoodEmoji(entry.mood)}</span>
                    <span class="journal-date">${formattedDate}</span>
                </div>
                <button class="btn-delete-journal" data-id="${entry.id}" title="Delete entry">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </div>
            <div class="journal-item-body">${escapeHTML(entry.content)}</div>
        `;

        // Handle delete
        const delBtn = item.querySelector('.btn-delete-journal');
        delBtn.addEventListener('click', () => {
            if (confirm("Are you sure you want to permanently delete this journal entry?")) {
                state.journalEntries = state.journalEntries.filter(e => e.id !== entry.id);
                saveState();
                renderJournalHistory(filterText);
            }
        });

        container.appendChild(item);
    });
}

// ==========================================================================
// TAB 4: MOCK COMMUNITY LOGIC
// ==========================================================================
let currentFilter = 'all';

function initCommunityTab() {
    const filterTags = document.querySelectorAll('.filter-tag');
    filterTags.forEach(tag => {
        tag.addEventListener('click', () => {
            filterTags.forEach(t => t.classList.remove('active'));
            tag.classList.add('active');
            currentFilter = tag.getAttribute('data-filter');
            renderCommunityPosts();
        });
    });

    const form = document.getElementById('community-post-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const tagVal = document.getElementById('post-tag').value;
            const contentVal = document.getElementById('post-content').value.trim();

            if (!contentVal) return;

            const post = {
                id: 'user-' + Date.now(),
                tag: tagVal,
                author: generateAnonName(),
                time: "Just now",
                content: contentVal,
                likes: 0,
                commentsCount: 0
            };

            state.userPosts.unshift(post);
            saveState();
            updateAchievements();

            form.reset();
            renderCommunityPosts();
            showToast("Shared Anonymously 🍵", "Your post has been successfully shared in the safety net feed.", "success");
        });
    }
}

function renderCommunityPosts() {
    const container = document.getElementById('community-posts-container');
    if (!container) return;

    container.innerHTML = '';

    // Merge seed posts and user posts
    let allPosts = [...state.userPosts, ...SEED_COMMUNITY_POSTS];

    // Apply Filter
    if (currentFilter !== 'all') {
        allPosts = allPosts.filter(post => post.tag === currentFilter);
    }

    if (allPosts.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fa-solid fa-message-slash"></i>
                <p>No community posts found in this category.</p>
            </div>
        `;
        return;
    }

    allPosts.forEach(post => {
        const isLiked = state.likedPosts.includes(post.id);
        
        // Dynamic Comment counts
        const commentsList = state.postComments[post.id] || getSeedComments(post.id);
        const commentsCount = commentsList.length;

        const card = document.createElement('div');
        card.className = 'glass-panel post-card';
        
        card.innerHTML = `
            <div class="post-header">
                <div class="post-author">
                    <div class="author-avatar">
                        <i class="fa-solid fa-user-shield"></i>
                    </div>
                    <div class="author-details">
                        <span class="author-name">${escapeHTML(post.author)}</span>
                        <span class="post-time">${post.time}</span>
                    </div>
                </div>
                <span class="post-tag ${post.tag.toLowerCase()}">${post.tag}</span>
            </div>
            <div class="post-body">${escapeHTML(post.content)}</div>
            <div class="post-footer">
                <button class="post-action-btn like-btn ${isLiked ? 'liked' : ''}" data-id="${post.id}">
                    <i class="fa-${isLiked ? 'solid' : 'regular'} fa-heart"></i> 
                    <span>${post.likes} Likes</span>
                </button>
                <button class="post-action-btn comment-btn" data-id="${post.id}">
                    <i class="fa-regular fa-comment"></i> 
                    <span>${commentsCount} Comments</span>
                </button>
            </div>
        `;

        // Handle Like Event
        const likeBtn = card.querySelector('.like-btn');
        likeBtn.addEventListener('click', () => {
            toggleLike(post.id, card);
        });

        // Handle Comment Event (Dynamic Comments Drawer)
        const commentBtn = card.querySelector('.comment-btn');
        commentBtn.addEventListener('click', () => {
            if (requiresPro("comments")) return;
            openCommentsDrawer(post.id);
        });

        container.appendChild(card);
    });
}

let activeCommentPostId = null;

function openCommentsDrawer(postId) {
    activeCommentPostId = postId;
    const modal = document.getElementById('comments-modal');
    if (!modal) return;

    modal.classList.remove('hidden-view');
    modal.classList.add('active-view');

    renderPostComments();
}

function renderPostComments() {
    const list = document.getElementById('comments-list');
    if (!list) return;

    list.innerHTML = '';
    
    if (!state.postComments[activeCommentPostId]) {
        state.postComments[activeCommentPostId] = getSeedComments(activeCommentPostId);
        saveState();
    }

    const comments = state.postComments[activeCommentPostId];

    if (comments.length === 0) {
        list.innerHTML = `
            <div class="empty-state">
                <i class="fa-solid fa-comments"></i>
                <p>No comments yet. Support your fellow healer bestie with a kind comment!</p>
            </div>
        `;
        return;
    }

    comments.forEach(c => {
        const item = document.createElement('div');
        item.className = 'comment-item';
        
        item.innerHTML = `
            <div class="comment-meta">
                <span class="comment-author">${escapeHTML(c.author)}</span>
                <span class="comment-time">${c.time}</span>
            </div>
            <div class="comment-text">${escapeHTML(c.content)}</div>
        `;
        list.appendChild(item);
    });

    list.scrollTop = list.scrollHeight;
}

function getSeedComments(postId) {
    const seedComments = {
        "seed-1": [
            { author: "HealingSpirit43", time: "2 hours ago", content: "Super proud of you! Burning that message is a major win. 👑" },
            { author: "WarriorSoul82", time: "1 hour ago", content: "Yesterday was hard for me too on Day 5. This gives me hope!" }
        ],
        "seed-2": [
            { author: "PhoenixRise09", time: "5 hours ago", content: "Checking their social media is a trap, bestie. Unfollow or block them for your sanity. 😭" },
            { author: "BraveSoul22", time: "4 hours ago", content: "It is 100% normal to feel broken. Give yourself time. You've got this." }
        ],
        "seed-3": [
            { author: "QuietWarrior87", time: "1 day ago", content: "Renaming them to 'DO NOT TEXT' saved me so many times. Highly recommend!" }
        ],
        "seed-4": [
            { author: "StrongPath11", time: "1 day ago", content: "Same. We are all detoxing from option C energy. Stay strong!" }
        ]
    };
    
    // Seed default comments count if seed doesn't exist
    const seedPost = SEED_COMMUNITY_POSTS.find(p => p.id === postId);
    const count = seedPost ? seedPost.commentsCount : 0;
    
    if (seedComments[postId]) {
        return seedComments[postId];
    }
    
    const placeholders = [];
    for (let i = 0; i < count; i++) {
        placeholders.push({
            author: generateAnonName(),
            time: `${i + 1} hours ago`,
            content: "Stay strong bestie! You deserve consistent premium energy, not breadcrumbs."
        });
    }
    return placeholders;
}

function setupCommentsDrawer() {
    const modal = document.getElementById('comments-modal');
    const closeBtn = document.getElementById('btn-close-comments');
    const form = document.getElementById('comment-input-form');
    const input = document.getElementById('comment-reply-text');

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active-view');
            modal.classList.add('hidden-view');
        });
    }

    if (form && input) {
        // Clone and replace form listeners to prevent double submits
        const newForm = form.cloneNode(true);
        form.parentNode.replaceChild(newForm, form);

        newForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const text = document.getElementById('comment-reply-text').value.trim();
            if (!text || !activeCommentPostId) return;

            const newComment = {
                author: generateAnonName(),
                time: "Just now",
                content: text
            };

            if (!state.postComments[activeCommentPostId]) {
                state.postComments[activeCommentPostId] = getSeedComments(activeCommentPostId);
            }

            state.postComments[activeCommentPostId].push(newComment);
            saveState();

            document.getElementById('comment-reply-text').value = '';
            renderPostComments();
            showToast("Comment Shared 🫂", "Your anonymous reply was shared with the community.", "success");

            renderCommunityPosts();
        });
    }
}

function toggleLike(postId, cardEl) {
    const isLiked = state.likedPosts.includes(postId);
    const likeBtn = cardEl.querySelector('.like-btn');
    const countSpan = likeBtn.querySelector('span');

    // Seed post references
    const seedIndex = SEED_COMMUNITY_POSTS.findIndex(p => p.id === postId);
    const userIndex = state.userPosts.findIndex(p => p.id === postId);

    if (isLiked) {
        // Unlike
        state.likedPosts = state.likedPosts.filter(id => id !== postId);
        
        if (seedIndex !== -1) SEED_COMMUNITY_POSTS[seedIndex].likes--;
        if (userIndex !== -1) state.userPosts[userIndex].likes--;
        
        likeBtn.classList.remove('liked');
        likeBtn.querySelector('i').className = 'fa-regular fa-heart';
    } else {
        // Like
        state.likedPosts.push(postId);
        
        if (seedIndex !== -1) SEED_COMMUNITY_POSTS[seedIndex].likes++;
        if (userIndex !== -1) state.userPosts[userIndex].likes++;
        
        likeBtn.classList.add('liked');
        likeBtn.querySelector('i').className = 'fa-solid fa-heart';
    }

    saveState();
    
    // Update local render values
    const currentPost = [...state.userPosts, ...SEED_COMMUNITY_POSTS].find(p => p.id === postId);
    if (currentPost) {
        countSpan.innerText = `${currentPost.likes} Likes`;
    }
}

// ==========================================================================
// TAB 5: HEALING PLAN & ACHIEVEMENTS LOGIC
// ==========================================================================
function initPlanTab() {
    const completeBtn = document.getElementById('btn-complete-day-task');
    if (completeBtn) {
        completeBtn.addEventListener('click', () => {
            const dayNum = state.activeDaySelected;
            
            if (state.completedTasks.includes(dayNum)) {
                // Toggle off
                state.completedTasks = state.completedTasks.filter(d => d !== dayNum);
            } else {
                // Toggle on
                state.completedTasks.push(dayNum);
            }
            
            saveState();
            updateAchievements();
            renderPlanCalendar();
            updateSelectedDayDetails(dayNum);
        });
    }
}

function renderPlanCalendar() {
    const container = document.getElementById('plan-days-container');
    if (!container) return;

    container.innerHTML = '';

    // We render 30 days
    for (let d = 1; d <= 30; d++) {
        const box = document.createElement('div');
        box.className = 'plan-day-box';
        box.innerText = d;

        // Is completed?
        const isCompleted = state.completedTasks.includes(d);
        if (isCompleted) {
            box.classList.add('completed');
            box.innerHTML = `${d} <span class="check-dot"></span>`;
        }

        // Is currently active day (calculated from actual streak)?
        const now = new Date().getTime();
        const diffMs = now - state.startDate;
        const currentStreakDays = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1; // 1-indexed day count
        
        if (d === currentStreakDays) {
            box.classList.add('active-day');
        }

        // Is previewed day?
        if (d === state.activeDaySelected) {
            box.style.borderColor = 'var(--primary-light)';
            box.style.background = 'rgba(255,255,255,0.06)';
        }

        // Click to view details
        box.addEventListener('click', () => {
            state.activeDaySelected = d;
            // Re-render to update highlights
            renderPlanCalendar();
            updateSelectedDayDetails(d);
        });

        container.appendChild(box);
    }
}

function updateSelectedDayDetails(dayNum) {
    const title = document.getElementById('day-details-title');
    const desc = document.getElementById('day-details-desc');
    const btn = document.getElementById('btn-complete-day-task');

    if (!title || !desc || !btn) return;

    const task = PLAN_TASKS.find(t => t.day === dayNum) || PLAN_TASKS[0];
    
    title.innerText = `Day ${task.day}: ${task.title}`;
    desc.innerText = task.desc;

    // Adjust button text
    if (state.completedTasks.includes(dayNum)) {
        btn.innerText = "Task Completed ✓";
        btn.className = "btn btn-secondary";
    } else {
        btn.innerText = "Mark Task Completed";
        btn.className = "btn btn-primary";
    }
}

// Achievements list
const ACHIEVEMENTS_LIST = [
    { id: 'streak-1', title: '24 Hours Strong', desc: 'Maintain No Contact for 1 full day', icon: '⚡' },
    { id: 'streak-7', title: '7 Days of Freedom', desc: 'Maintain No Contact for 7 days', icon: '🛡️' },
    { id: 'streak-30', title: '30 Days Transformed', desc: 'Maintain No Contact for 30 days', icon: '👑' },
    { id: 'tempt-1', title: 'Urge Defeated', desc: 'Use emergency mode to resist an urge', icon: '🔥' },
    { id: 'tempt-5', title: 'Master of Urges', desc: 'Defeat 5 separate contact urges', icon: '🧘' },
    { id: 'journ-1', title: 'First Expression', desc: 'Log your first emotional journal entry', icon: '✍️' },
    { id: 'journ-5', title: 'Healing Chronicler', desc: 'Write 5 journal entries to release weight', icon: '📚' },
    { id: 'comm-1', title: 'Vocal Healer', desc: 'Share your first post in the community', icon: '🫂' }
];

function updateAchievements() {
    const unlocked = [];
    const now = new Date().getTime();
    const diffMs = now - state.startDate;
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    // Evaluate conditions
    if (days >= 1) unlocked.push('streak-1');
    if (days >= 7) unlocked.push('streak-7');
    if (days >= 30) unlocked.push('streak-30');
    if (state.temptationsDefeated >= 1) unlocked.push('tempt-1');
    if (state.temptationsDefeated >= 5) unlocked.push('tempt-5');
    if (state.journalEntries.length >= 1) unlocked.push('journ-1');
    if (state.journalEntries.length >= 5) unlocked.push('journ-5');
    if (state.userPosts.length >= 1) unlocked.push('comm-1');

    state.achievements = unlocked;
    saveState();

    renderAchievements();
}

function renderAchievements() {
    const container = document.getElementById('achievements-container');
    if (!container) return;

    container.innerHTML = '';

    ACHIEVEMENTS_LIST.forEach(ach => {
        const isUnlocked = state.achievements.includes(ach.id);
        const card = document.createElement('div');
        card.className = `achievement-card ${isUnlocked ? 'unlocked' : ''}`;
        
        card.innerHTML = `
            <div class="badge-icon-wrapper">
                <span>${ach.icon}</span>
            </div>
            <h4>${ach.title}</h4>
            <p>${ach.desc}</p>
        `;

        container.appendChild(card);
    });
}

// ==========================================================================
// V2.0 UPGRADE - INTUITIVE COMPONENT CONTROLLERS
// ==========================================================================

// --- 1. SCIENTIFIC BLOGS & TRENDS ENGINE ---
const DAILY_TRENDS = [
    { topic: "Dopamine Withdrawal Syndrome", spike: "+182%", category: "Neuroscience", citation: "Fisher et al. (Journal of Neurophysiology): Reward & Addiction circuits in heartbreak rejection.", articleId: "5" },
    { topic: "Anxious Attachment Activation", spike: "+245%", category: "Attachment Theory", citation: "Bowlby & Ainsworth (Attachment theory foundations): Abandonment triggers and protest behaviors.", articleId: "7" },
    { topic: "Cortisol Stress Response", spike: "+195%", category: "Neuroscience", citation: "Sapolsky et al. (Endocrine Reviews): Physiological damages of prolonged interpersonal stress.", articleId: "6" },
    { topic: "Zeigarnik Effect in Closure", spike: "+130%", category: "Psychology", citation: "Zeigarnik et al. (Psychological Research): Unfinished cognitive loops and intrusive memory.", articleId: "8" },
    { topic: "Rumination & Cognitive Reframing", spike: "+210%", category: "Psychology", citation: "Beck et al. (Cognitive Therapy & Research): Disrupting negative memory cycles via thought stopping.", articleId: "9" },
    { topic: "Neuroplasticity and Habit Re-wiring", spike: "+280%", category: "Neuroscience", citation: "Doidge et al. (Brain Science Journal): Synaptic pruning and neural boundary rebuilding.", articleId: "10" }
];

let activeBlogCategory = 'all';
let currentTrendReport = DAILY_TRENDS[0];

function initBlogsTab() {
    // Determine daily trend seed based on calendar date
    const daySeed = new Date().getDate() % DAILY_TRENDS.length;
    currentTrendReport = DAILY_TRENDS[daySeed];
    
    // Render Trend Dashboard Banner
    const trendTopic = document.getElementById('trend-topic-name');
    const trendCitation = document.getElementById('trend-study-citation');
    
    if (trendTopic) trendTopic.innerText = currentTrendReport.topic;
    if (trendCitation) trendCitation.innerText = currentTrendReport.citation;

    // Render Free Read Counter
    const freeCounter = document.getElementById('blog-free-counter-card');
    const readCountStr = document.getElementById('blog-read-count');
    
    if (state.subscription !== 'free') {
        if (freeCounter) freeCounter.style.display = 'none';
    } else {
        if (freeCounter) freeCounter.style.display = 'flex';
        if (readCountStr) readCountStr.innerText = `${state.readArticlesCount}/3`;
    }

    renderBlogsGrid();

    // Bind Category Chips
    const categoryChips = document.querySelectorAll('.category-chip');
    categoryChips.forEach(chip => {
        chip.addEventListener('click', () => {
            categoryChips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            activeBlogCategory = chip.getAttribute('data-category');
            renderBlogsGrid();
        });
    });

    // Bind Search input
    const blogSearch = document.getElementById('blog-search');
    if (blogSearch) {
        blogSearch.addEventListener('input', () => {
            renderBlogsGrid(blogSearch.value.trim().toLowerCase());
        });
    }

    // Bind Read Featured Trend
    const readTrendBtn = document.getElementById('btn-read-featured-trend');
    if (readTrendBtn) {
        // Remove old listeners by cloning
        const newBtn = readTrendBtn.cloneNode(true);
        readTrendBtn.parentNode.replaceChild(newBtn, readTrendBtn);
        newBtn.addEventListener('click', () => {
            openArticleDetails(currentTrendReport.articleId);
        });
    }
}

function renderBlogsGrid(searchQuery = '') {
    const container = document.getElementById('blogs-grid-container');
    if (!container) return;

    container.innerHTML = '';

    Object.keys(ARTICLES).forEach((id, index) => {
        const art = ARTICLES[id];
        
        // Apply category filter
        if (activeBlogCategory !== 'all' && art.category !== activeBlogCategory) return;

        // Apply search query
        if (searchQuery && 
            !art.title.toLowerCase().includes(searchQuery) && 
            !art.category.toLowerCase().includes(searchQuery) && 
            !art.keywords.toLowerCase().includes(searchQuery)) return;

        const card = document.createElement('div');
        
        // Define if this article is premium paywall locked
        // Free tier gets first 3 articles, remaining are locked
        const isLocked = state.subscription === 'free' && index >= 3;
        
        card.className = `glass-panel blog-card-pro ${isLocked ? 'locked-blog' : ''}`;
        card.setAttribute('data-id', id);

        card.innerHTML = `
            ${isLocked ? `<span class="card-lock-badge"><i class="fa-solid fa-lock"></i> PRO</span>` : ''}
            <span class="category-badge">${art.category}</span>
            <h3>${art.title}</h3>
            <p>${art.content.replace(/<[^>]*>/g, '').substring(0, 100)}...</p>
            <div class="card-footer-meta">
                <span>By ${art.author}</span>
                <span>${art.readTime}</span>
            </div>
        `;

        card.addEventListener('click', () => {
            if (isLocked) {
                requiresPro('blogs');
            } else {
                openArticleDetails(id);
            }
        });

        container.appendChild(card);
    });
}

function openArticleDetails(id) {
    const art = ARTICLES[id];
    if (!art) return;

    // Track free article reading counts
    if (state.subscription === 'free' && !state.readArticlesList.includes(id)) {
        state.readArticlesCount++;
        state.readArticlesList.push(id);
        saveState();
        const readCountStr = document.getElementById('blog-read-count');
        if (readCountStr) readCountStr.innerText = `${state.readArticlesCount}/3`;
    }

    const modal = document.getElementById('article-modal');
    if (!modal) return;

    document.getElementById('modal-article-category').innerText = art.category;
    document.getElementById('modal-article-title').innerText = art.title;
    
    // Add Gen Z meta tags and author
    const metaHTML = `
        <div class="article-meta-row mb-4" style="display:flex; justify-content:space-between; font-size:0.8rem; color:var(--text-secondary); border-bottom:1px solid rgba(255,255,255,0.05); padding-bottom:12px;">
            <span><i class="fa-solid fa-user-pen"></i> ${art.author}</span>
            <span><i class="fa-solid fa-clock"></i> ${art.readTime}</span>
        </div>
    `;
    document.getElementById('modal-article-content').innerHTML = metaHTML + art.content;

    modal.classList.remove('hidden-view');
    modal.classList.add('active-view');
}

function setupArticleModal() {
    const modal = document.getElementById('article-modal');
    const closeBtn = document.getElementById('btn-close-modal');
    const closeFooterBtn = document.getElementById('btn-modal-close-footer');

    const closeModal = () => {
        modal.classList.remove('active-view');
        modal.classList.add('hidden-view');
    };

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (closeFooterBtn) closeFooterBtn.addEventListener('click', closeModal);
}

// --- 2. GUIDED MEDITATION PLAYER ENGINE ---
const MEDITATION_STEPS = {
    "letting-go": [
        { time: 5, prompt: "Close your eyes. Take a deep, settling breath... 🧘" },
        { time: 55, prompt: "Visualize your ex's energy as a fading mist. Breathe in peace, exhale their hold. 💨" },
        { time: 115, prompt: "Feel your heart space expanding. You are returning to your own center. 👑" },
        { time: 175, prompt: "With each breath, release any resentment. Your peace is your power. ✨" },
        { time: 235, prompt: "You are whole on your own. Rest in this quiet strength. 🧘" }
    ],
    "self-compassion": [
        { time: 5, prompt: "Place your hands on your heart. Breathe in tenderness... 🥺" },
        { time: 75, prompt: "Acknowledge the pain you feel. It is a sign of your beautiful capacity to care. 💖" },
        { time: 150, prompt: "Say to yourself: 'May I be gentle with myself. May I offer myself safety.' 🛡️" },
        { time: 225, prompt: "You are doing your absolute best. Let the tension melt from your shoulders. 🧘" },
        { time: 300, prompt: "Rest in the safety of this present moment. You are protected. ✨" }
    ],
    "cord-cutting": [
        { time: 5, prompt: "Breathe in strength. Feel your spine grow tall and rooted... ⚡" },
        { time: 70, prompt: "Visualize a glowing cord of shared energy between you and your ex. 🔌" },
        { time: 140, prompt: "With a deep exhale, imagine cutting this cord cleanly. Your energy returns to you. ✂️" },
        { time: 210, prompt: "See their energy drift away in peace. Reclaim your personal boundaries. 🛡️" },
        { time: 280, prompt: "You are separate, free, and fully sovereign in your body. 👑" }
    ],
    "affirmations": [
        { time: 5, prompt: "Breathe in energy. Today, we choose our self-worth. 📈" },
        { time: 40, prompt: "Silently repeat: 'I am the prize. I protect my boundaries at all costs.' 👑" },
        { time: 80, prompt: "Repeat: 'No Contact is my ultimate power move. I am leveled up.' 💅" },
        { time: 120, prompt: "Repeat: 'I deserve consistent love, and I choose myself today.' ⚡" },
        { time: 160, prompt: "Take a deep breath of triumph. You are unstoppable. ✨" }
    ],
    "evening": [
        { time: 5, prompt: "Prepare for deep rest. Let go of today's thoughts... 💤" },
        { time: 60, prompt: "Feel your breathing slow down. Exhale any residual anxiety. 🌊" },
        { time: 120, prompt: "Let go of what you cannot control. The past is done. 🔒" },
        { time: 180, prompt: "You survived today without folding. Sleep with absolute pride. 😴" },
        { time: 240, prompt: "Your brain is healing while you rest. Safe travels to sleep, bestie. ✨" }
    ]
};

let meditationInterval = null;
let activeTrackKey = 'letting-go';
let meditationTimeLeft = 300; // in seconds
let meditationTotalTime = 300;
let isMeditationPlaying = false;

function initMeditationTab() {
    updateSubscriptionUI();
    
    const trackCards = document.querySelectorAll('.meditation-track-card');
    trackCards.forEach(card => {
        card.addEventListener('click', () => {
            if (isMeditationPlaying) {
                showToast("Track Locked", "Please reset the current player to select a different track.", "warning");
                return;
            }
            trackCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            
            activeTrackKey = card.getAttribute('data-track');
            resetMeditationPlayer();
        });
    });

    const playBtn = document.getElementById('btn-meditation-play');
    const resetBtn = document.getElementById('btn-meditation-reset');

    if (playBtn) {
        const newPlay = playBtn.cloneNode(true);
        playBtn.parentNode.replaceChild(newPlay, playBtn);
        newPlay.addEventListener('click', () => {
            if (requiresPro('meditation')) return;
            toggleMeditationPlay();
        });
    }

    if (resetBtn) {
        const newReset = resetBtn.cloneNode(true);
        resetBtn.parentNode.replaceChild(newReset, resetBtn);
        newReset.addEventListener('click', resetMeditationPlayer);
    }

    resetMeditationPlayer();
}

let synthAudioContext = null;
let waveNoiseNode = null;
let waveFilterNode = null;
let waveGainNode = null;
let waveLfoNode = null;
let warmSynthOscillators = [];
let warmSynthFilterNode = null;
let warmSynthGainNode = null;
let warmSynthLfoNode = null;

function startAmbientSynthesis(trackKey) {
    try {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) return;

        // Initialize audio context
        synthAudioContext = new AudioContextClass();

        if (trackKey === 'self-compassion') {
            // OCEAN WAVES GENERATION:
            // 1. Create a white noise buffer
            const bufferSize = synthAudioContext.sampleRate * 2; // 2 seconds buffer
            const noiseBuffer = synthAudioContext.createBuffer(1, bufferSize, synthAudioContext.sampleRate);
            const output = noiseBuffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                output[i] = Math.random() * 2 - 1;
            }

            // 2. Noise Source Node
            waveNoiseNode = synthAudioContext.createBufferSource();
            waveNoiseNode.buffer = noiseBuffer;
            waveNoiseNode.loop = true;

            // 3. Resonant Bandpass Filter Node
            waveFilterNode = synthAudioContext.createBiquadFilter();
            waveFilterNode.type = 'bandpass';
            waveFilterNode.Q.value = 1.8;
            waveFilterNode.frequency.value = 400; // starting frequency

            // 4. Gain Node for Volume Control
            waveGainNode = synthAudioContext.createGain();
            waveGainNode.gain.value = 0.08;

            // 5. LFO to Sweep Filter Frequency & Gain (Modulate waves)
            // This sweeps the filter cut-off up and down to create 'rolling tide' shhh... hhh... shhh...
            waveLfoNode = synthAudioContext.createOscillator();
            waveLfoNode.type = 'sine';
            waveLfoNode.frequency.value = 0.08; // extremely slow wave cycle (12 seconds)

            const lfoGain = synthAudioContext.createGain();
            lfoGain.gain.value = 250; // sweep frequency by 250Hz

            // Connect LFO modulation
            waveLfoNode.connect(lfoGain);
            lfoGain.connect(waveFilterNode.frequency);

            // Connect Audio Routing
            waveNoiseNode.connect(waveFilterNode);
            waveFilterNode.connect(waveGainNode);
            waveGainNode.connect(synthAudioContext.destination);

            // Start nodes
            waveNoiseNode.start(0);
            waveLfoNode.start(0);

        } else {
            // COZY CABIN RAIN & WIND SYNTHESIS (Letting Go, Evening, Cord Cutting, Affirmations):
            // Instead of a robotic "om" drone hum, we synthesize a highly relaxing, natural rain & wind soundscape.
            
            // 1. Create a white noise buffer for rain
            const bufferSize = synthAudioContext.sampleRate * 2;
            const noiseBuffer = synthAudioContext.createBuffer(1, bufferSize, synthAudioContext.sampleRate);
            const output = noiseBuffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                output[i] = Math.random() * 2 - 1;
            }

            // 2. Rain Source Node
            waveNoiseNode = synthAudioContext.createBufferSource();
            waveNoiseNode.buffer = noiseBuffer;
            waveNoiseNode.loop = true;

            // 3. Rain Filter Node (Bandpass at 1000Hz to simulate rain drops/hiss)
            waveFilterNode = synthAudioContext.createBiquadFilter();
            waveFilterNode.type = 'bandpass';
            waveFilterNode.frequency.value = 1000;
            waveFilterNode.Q.value = 0.7;

            // 4. Rain Gain Node (very soft volume)
            waveGainNode = synthAudioContext.createGain();
            waveGainNode.gain.value = 0.04;

            // 5. Cozy Wind Source (Triangle oscillator at low pitch modulated slowly to simulate wind gusting)
            const windOsc = synthAudioContext.createOscillator();
            windOsc.type = 'triangle';
            windOsc.frequency.value = 45; // ultra-low sub frequency for wind rumble
            
            const windFilter = synthAudioContext.createBiquadFilter();
            windFilter.type = 'lowpass';
            windFilter.frequency.value = 120; // lowpass filter for deep wind rumble

            const windGain = synthAudioContext.createGain();
            windGain.gain.value = 0.08;

            // LFO to modulate wind gusts
            warmSynthLfoNode = synthAudioContext.createOscillator();
            warmSynthLfoNode.type = 'sine';
            warmSynthLfoNode.frequency.value = 0.05; // very slow 20s gusts

            const windLfoGain = synthAudioContext.createGain();
            windLfoGain.gain.value = 40;

            warmSynthLfoNode.connect(windLfoGain);
            windLfoGain.connect(windFilter.frequency);

            // Connect Wind Nodes
            windOsc.connect(windFilter);
            windFilter.connect(windGain);
            windGain.connect(synthAudioContext.destination);

            // Connect Rain Nodes
            waveNoiseNode.connect(waveFilterNode);
            waveFilterNode.connect(waveGainNode);
            waveGainNode.connect(synthAudioContext.destination);

            // Keep reference to stop them cleanly
            warmSynthOscillators = [windOsc];
            
            // Start everything
            waveNoiseNode.start(0);
            windOsc.start(0);
            warmSynthLfoNode.start(0);
        }

    } catch (e) {
        console.warn("Web Audio API Ambient Synthesis could not start in this browser context:", e);
    }
}

function stopAmbientSynthesis() {
    try {
        // Stop wave nodes
        if (waveNoiseNode) { waveNoiseNode.stop(); waveNoiseNode = null; }
        if (waveLfoNode) { waveLfoNode.stop(); waveLfoNode = null; }
        waveFilterNode = null;
        waveGainNode = null;

        // Stop synth chords nodes
        if (warmSynthOscillators.length > 0) {
            warmSynthOscillators.forEach(osc => {
                try { osc.stop(); } catch(err){}
            });
            warmSynthOscillators = [];
        }
        if (warmSynthLfoNode) { warmSynthLfoNode.stop(); warmSynthLfoNode = null; }
        warmSynthFilterNode = null;
        warmSynthGainNode = null;

        // Close context
        if (synthAudioContext && synthAudioContext.state !== 'closed') {
            synthAudioContext.close();
            synthAudioContext = null;
        }
    } catch (e) {
        console.warn("Web Audio API Ambient synthesis shutdown error:", e);
    }
}

function resetMeditationPlayer() {
    if (meditationInterval) clearInterval(meditationInterval);
    isMeditationPlaying = false;
    
    // Stop audio synthesis
    stopAmbientSynthesis();
    
    // Set time based on track
    if (activeTrackKey === 'letting-go' || activeTrackKey === 'evening') {
        meditationTotalTime = 300; // 5 min
    } else if (activeTrackKey === 'self-compassion') {
        meditationTotalTime = 420; // 7 min
    } else if (activeTrackKey === 'cord-cutting') {
        meditationTotalTime = 360; // 6 min
    } else {
        meditationTotalTime = 180; // 3 min
    }

    meditationTimeLeft = meditationTotalTime;
    
    const playBtn = document.getElementById('btn-meditation-play');
    if (playBtn) playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
    
    const container = document.querySelector('.meditation-player-card');
    if (container) container.classList.remove('playing');

    updateMeditationDisplay();
}

function toggleMeditationPlay() {
    isMeditationPlaying = !isMeditationPlaying;
    const playBtn = document.getElementById('btn-meditation-play');
    const container = document.querySelector('.meditation-player-card');

    if (isMeditationPlaying) {
        if (playBtn) playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
        if (container) container.classList.add('playing');
        showToast("Zen Mode Active", "Focus on your breathing bestie. Let the anxiety pass.", "info");

        // Start audio synthesis
        startAmbientSynthesis(activeTrackKey);

        meditationInterval = setInterval(() => {
            meditationTimeLeft--;
            updateMeditationDisplay();

            if (meditationTimeLeft <= 0) {
                clearInterval(meditationInterval);
                resetMeditationPlayer();
                showToast("Zen Completed", "Achievement Unlocked: Balanced Energy! Proud of you bestie. 🧘", "success");
                
                // Play Achievement Sound (Simulated)
                playCalmingChime();
            }
        }, 1000);
    } else {
        if (playBtn) playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
        if (container) container.classList.remove('playing');
        if (meditationInterval) clearInterval(meditationInterval);
        
        // Stop audio synthesis
        stopAmbientSynthesis();
    }
}

function updateMeditationDisplay() {
    const timeDisplay = document.getElementById('meditation-time');
    const promptDisplay = document.getElementById('meditation-prompt');
    const progressCircle = document.getElementById('meditation-progress');

    if (timeDisplay) {
        const m = Math.floor(meditationTimeLeft / 60);
        const s = meditationTimeLeft % 60;
        timeDisplay.innerText = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }

    // Update prompt text based on seconds completed
    const elapsed = meditationTotalTime - meditationTimeLeft;
    const steps = MEDITATION_STEPS[activeTrackKey] || MEDITATION_STEPS["letting-go"];
    
    // Find current prompt matching elapsed seconds
    let activePrompt = steps[0].prompt;
    for (let i = 0; i < steps.length; i++) {
        if (elapsed >= steps[i].time) {
            activePrompt = steps[i].prompt;
        }
    }
    
    if (promptDisplay && promptDisplay.innerText !== activePrompt) {
        promptDisplay.style.opacity = '0';
        setTimeout(() => {
            promptDisplay.innerText = activePrompt;
            promptDisplay.style.opacity = '1';
        }, 300);
    }

    // Update Circle Progress
    if (progressCircle) {
        const radius = 90;
        const circumference = radius * 2 * Math.PI; // approx 565.48
        progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
        
        const percentage = (meditationTimeLeft / meditationTotalTime);
        const offset = circumference - (percentage * circumference);
        progressCircle.style.strokeDashoffset = offset;
    }
}

// --- 3. SETTINGS & PREFERENCES MANAGER ---
function initSettingsTab() {
    updateSubscriptionUI();

    const nameInput = document.getElementById('settings-ex-name');
    const dateInput = document.getElementById('settings-start-date');
    const planSelect = document.getElementById('settings-plan-track');
    const soundToggle = document.getElementById('settings-sound-toggle');
    const apiKeyInput = document.getElementById('settings-openai-key');
    const toggleKeyBtn = document.getElementById('btn-toggle-key-visibility');

    if (nameInput) nameInput.value = state.exName;
    
    if (dateInput && state.startDate) {
        const localISO = new Date(state.startDate - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16);
        dateInput.value = localISO;
    }

    if (planSelect) planSelect.value = state.selectedPlan;
    if (soundToggle) soundToggle.checked = state.soundEffects;

    if (apiKeyInput && state.openAiApiKey) {
        apiKeyInput.value = state.openAiApiKey;
    }

    if (toggleKeyBtn && apiKeyInput) {
        const newToggleBtn = toggleKeyBtn.cloneNode(true);
        toggleKeyBtn.parentNode.replaceChild(newToggleBtn, toggleKeyBtn);
        newToggleBtn.addEventListener('click', () => {
            if (apiKeyInput.type === 'password') {
                apiKeyInput.type = 'text';
                newToggleBtn.innerHTML = '<i class="fa-solid fa-eye-slash"></i>';
            } else {
                apiKeyInput.type = 'password';
                newToggleBtn.innerHTML = '<i class="fa-solid fa-eye"></i>';
            }
        });
    }

    const form = document.getElementById('settings-form');
    if (form) {
        // Clone and re-bind to prevent duplication
        const newForm = form.cloneNode(true);
        form.parentNode.replaceChild(newForm, form);
        
        newForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const newName = document.getElementById('settings-ex-name').value.trim();
            const newDateVal = document.getElementById('settings-start-date').value;
            const newPlan = document.getElementById('settings-plan-track').value;
            const newSound = document.getElementById('settings-sound-toggle').checked;
            const newKey = document.getElementById('settings-openai-key').value.trim();

            state.exName = newName || 'your ex';
            if (newDateVal) {
                state.startDate = new Date(newDateVal).getTime();
            }
            state.selectedPlan = newPlan;
            state.soundEffects = newSound;
            state.openAiApiKey = newKey;

            saveState();
            showToast("Settings Saved", "Your boundaries and configurations have been successfully updated.", "success");
            
            initDashboard();
        });

        // Re-bind reset app click inside new form
        const resetBtn = document.getElementById('btn-settings-reset');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                if (confirm("WARNING: This will wipe your streak, journal entries, achievements, and settings. Proceed?")) {
                    localStorage.removeItem('no_contact_state');
                    state = { ...DEFAULT_STATE };
                    window.location.reload();
                }
            });
        }
    }

    // Export Data Bind
    const exportBtn = document.getElementById('btn-export-data');
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state));
            const downloadAnchor = document.createElement('a');
            downloadAnchor.setAttribute("href", dataStr);
            downloadAnchor.setAttribute("download", `no_contact_glowup_backup_${Date.now()}.json`);
            document.body.appendChild(downloadAnchor);
            downloadAnchor.click();
            downloadAnchor.remove();
            showToast("Export Completed", "Your data package was successfully downloaded.", "success");
        });
    }

    // Import Data Bind
    const importBtn = document.getElementById('btn-import-data');
    const fileInput = document.getElementById('import-file-input');
    
    if (importBtn && fileInput) {
        importBtn.addEventListener('click', () => {
            fileInput.click();
        });

        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const parsed = JSON.parse(event.target.result);
                    if (parsed.hasStarted !== undefined) {
                        state = { ...DEFAULT_STATE, ...parsed };
                        saveState();
                        showToast("Data Imported", "Your recovery timeline has been successfully synced.", "success");
                        setTimeout(() => window.location.reload(), 1000);
                    } else {
                        showToast("Failed Sync", "Invalid backup JSON file.", "error");
                    }
                } catch (err) {
                    showToast("Sync Error", "Could not parse JSON schema.", "error");
                }
            };
            reader.readAsText(file);
        });
    }
}

// --- 4. SUBSCRIPTION MONETIZATION & CHECKOUT FLOW ---
let selectedUpgradeTier = 'monthly';

function initPricingTab() {
    const tierButtons = document.querySelectorAll('.btn-select-tier');
    tierButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            selectedUpgradeTier = btn.getAttribute('data-tier');
            openCheckoutModal();
        });
    });
}

function openCheckoutModal() {
    const modal = document.getElementById('payment-modal');
    if (!modal) return;

    // Reset payment fields
    document.getElementById('cc-name').value = '';
    document.getElementById('cc-number').value = '';
    document.getElementById('cc-expiry').value = '';
    document.getElementById('cc-cvc').value = '';

    // Reset card preview
    document.getElementById('cc-name-preview').innerText = 'HEALER BESTIE';
    document.getElementById('cc-number-preview').innerText = '•••• •••• •••• ••••';
    document.getElementById('cc-expiry-preview').innerText = 'MM/YY';

    modal.classList.remove('hidden-view');
    modal.classList.add('active-view');
    
    // Bind Card Real-time Keypress Preview
    const ccNameInput = document.getElementById('cc-name');
    const ccNumInput = document.getElementById('cc-number');
    const ccExpInput = document.getElementById('cc-expiry');

    ccNameInput.addEventListener('input', () => {
        document.getElementById('cc-name-preview').innerText = ccNameInput.value.toUpperCase() || 'HEALER BESTIE';
    });

    ccNumInput.addEventListener('input', () => {
        let val = ccNumInput.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        let formatted = '';
        for (let i = 0; i < val.length; i++) {
            if (i > 0 && i % 4 === 0) formatted += ' ';
            formatted += val[i];
        }
        ccNumInput.value = formatted.substring(0, 19);
        document.getElementById('cc-number-preview').innerText = formatted || '•••• •••• •••• ••••';
    });

    ccExpInput.addEventListener('input', () => {
        let val = ccExpInput.value.replace(/\//g, '').replace(/[^0-9]/gi, '');
        if (val.length >= 2) {
            ccExpInput.value = `${val.substring(0,2)}/${val.substring(2,4)}`;
        } else {
            ccExpInput.value = val;
        }
        document.getElementById('cc-expiry-preview').innerText = ccExpInput.value || 'MM/YY';
    });
}

function setupPaymentModal() {
    const modal = document.getElementById('payment-modal');
    const closeBtn = document.getElementById('btn-close-payment');
    const payForm = document.getElementById('payment-form');

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active-view');
            modal.classList.add('hidden-view');
        });
    }

    if (payForm) {
        payForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Trigger simulated checkout load
            const payBtn = document.getElementById('btn-confirm-payment');
            payBtn.disabled = true;
            payBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Securing Network...';
            
            setTimeout(() => {
                state.subscription = selectedUpgradeTier;
                saveState();
                
                // Success chimes
                playCalmingChime();
                
                showToast("Upgrade Completed 👑", `Bestie, you are now officially a NoContact Pro member! Energy level spiked.`, "success");
                
                modal.classList.remove('active-view');
                modal.classList.add('hidden-view');
                
                const paywallModal = document.getElementById('paywall-modal');
                if (paywallModal) {
                    paywallModal.classList.remove('active-view');
                    paywallModal.classList.add('hidden-view');
                }
                
                updateSubscriptionUI();
                switchTab('dashboard');
                
                payBtn.disabled = false;
                payBtn.innerText = 'Pay and Upgrade';
            }, 1800);
        });
    }

    // Bind Paywall modal button clicks
    const paywallUpgrade = document.getElementById('btn-paywall-upgrade');
    const paywallClose = document.getElementById('btn-paywall-close-footer');
    const paywallCloseHeader = document.getElementById('btn-close-paywall');

    const closePaywall = () => {
        const pModal = document.getElementById('paywall-modal');
        pModal.classList.remove('active-view');
        pModal.classList.add('hidden-view');
    };

    if (paywallUpgrade) {
        paywallUpgrade.addEventListener('click', () => {
            closePaywall();
            switchTab('pricing');
        });
    }

    if (paywallClose) paywallClose.addEventListener('click', closePaywall);
    if (paywallCloseHeader) paywallCloseHeader.addEventListener('click', closePaywall);
}

// --- 5. INTERACTIVE DAILY CHECK-IN & CANVAS INSIGHTS ---
let checkinSleepVal = 3; // Good
let checkinTemptVal = 0; // No

function setupDailyCheckin() {
    const trigger = document.getElementById('btn-daily-checkin-trigger');
    const modal = document.getElementById('checkin-modal');
    const closeBtn = document.getElementById('btn-close-checkin');
    
    const openCheckin = () => {
        if (requiresPro('checkin')) return;
        
        // Reset slider
        const slider = document.getElementById('checkin-mood-slider');
        if (slider) {
            slider.value = 5;
            updateCheckinMoodDisplay(5);
        }
        
        modal.classList.remove('hidden-view');
        modal.classList.add('active-view');
    };

    if (trigger) trigger.addEventListener('click', openCheckin);
    
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active-view');
            modal.classList.add('hidden-view');
        });
    }

    // Auto prompt check-in on load if not completed today
    setTimeout(() => {
        if (state.hasStarted && state.startDate && state.subscription === 'pro') {
            const todayStr = new Date().toISOString().slice(0, 10);
            if (!state.checkedInDays[todayStr]) {
                openCheckin();
            }
        }
    }, 2000);

    // Sleep Selection Bind
    const sleepBtns = document.querySelectorAll('.sleep-btn');
    sleepBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            sleepBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            checkinSleepVal = parseInt(btn.getAttribute('data-val'));
        });
    });

    // Temptation Selection Bind
    const temptBtns = document.querySelectorAll('.tempt-btn');
    temptBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            temptBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            checkinTemptVal = parseInt(btn.getAttribute('data-val'));
        });
    });

    // Mood Slider Drag Bind
    const moodSlider = document.getElementById('checkin-mood-slider');
    if (moodSlider) {
        moodSlider.addEventListener('input', (e) => {
            updateCheckinMoodDisplay(parseInt(e.target.value));
        });
    }

    // Submit handler
    const form = document.getElementById('checkin-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const mood = parseInt(document.getElementById('checkin-mood-slider').value);
            const todayStr = new Date().toISOString().slice(0, 10);

            state.checkedInDays[todayStr] = {
                mood: mood,
                sleep: checkinSleepVal,
                temptation: checkinTemptVal,
                timestamp: Date.now()
            };

            saveState();
            showToast("Daily Logged ✨", "Your mental metrics have been tracked. Main character curve unlocked!", "success");
            
            modal.classList.remove('active-view');
            modal.classList.add('hidden-view');
            
            // Draw mood graph
            drawMoodChart();
        });
    }
}

function updateCheckinMoodDisplay(val) {
    const emojis = {
        1: "😭 Screaming Crying",
        2: "😢 Sad / Gloomy",
        3: "😰 Anxious / Relational Withdrawal",
        4: "😐 In My Head",
        5: "🧘 Grounded / Quiet",
        6: "🔋 Recharging",
        7: "✨ Thriving / Delusional Glow",
        8: "🔥 Locked In",
        9: "👑 Main Character Era",
        10: "💅 Slay / Completely Unbothered"
    };

    const emojiDisplay = document.getElementById('checkin-mood-emoji');
    const valDisplay = document.getElementById('checkin-mood-val');

    if (emojiDisplay) emojiDisplay.innerText = emojis[val].split(' ')[0];
    if (valDisplay) valDisplay.innerText = emojis[val];
}

// Draw beautiful HTML5 Canvas Mood Trend Line
let activeChartDays = 7;

function drawMoodChart() {
    const canvas = document.getElementById('moodChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    
    // Set device pixel ratio scaling for crisp canvas lines
    canvas.width = width;
    canvas.height = height;

    ctx.clearRect(0, 0, width, height);

    // Extract sorted checked in days
    const checkedDates = Object.keys(state.checkedInDays).sort((a,b) => new Date(a) - new Date(b));
    
    // Filter to last N days
    const limit = activeChartDays;
    const filteredDates = checkedDates.slice(-limit);

    // Mock fallback if data is insufficient
    if (filteredDates.length < 2) {
        drawMockChart(ctx, width, height);
        return;
    }

    // Grid lines setup
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    for (let i = 1; i < 5; i++) {
        const y = (height / 5) * i;
        ctx.beginPath();
        ctx.moveTo(40, y);
        ctx.lineTo(width - 20, y);
        ctx.stroke();
    }

    // X and Y scales math
    const paddingLeft = 40;
    const paddingRight = 20;
    const paddingTop = 20;
    const paddingBottom = 30;
    
    const chartWidth = width - paddingLeft - paddingRight;
    const chartHeight = height - paddingTop - paddingBottom;

    const points = filteredDates.map((dateStr, idx) => {
        const checkin = state.checkedInDays[dateStr];
        const x = paddingLeft + (idx / (filteredDates.length - 1)) * chartWidth;
        // Inverse mood scale (y=0 is top, mood=10 is top)
        const y = paddingTop + (1 - (checkin.mood / 10)) * chartHeight;
        return { x, y, dateStr, mood: checkin.mood };
    });

    // Fill curve gradient area
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, 'rgba(167, 139, 250, 0.25)');
    gradient.addColorStop(1, 'rgba(124, 58, 237, 0)');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(points[0].x, height - paddingBottom);
    
    // Draw smooth cubic spline line
    ctx.lineTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
        const xc = (points[i - 1].x + points[i].x) / 2;
        const yc = (points[i - 1].y + points[i].y) / 2;
        ctx.quadraticCurveTo(points[i - 1].x, points[i - 1].y, xc, yc);
    }
    ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
    ctx.lineTo(points[points.length - 1].x, height - paddingBottom);
    ctx.closePath();
    ctx.fill();

    // Draw main glowing path line
    ctx.strokeStyle = '#a78bfa';
    ctx.lineWidth = 3;
    ctx.shadowBlur = 12;
    ctx.shadowColor = 'var(--primary-glow)';
    
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
        const xc = (points[i - 1].x + points[i].x) / 2;
        const yc = (points[i - 1].y + points[i].y) / 2;
        ctx.quadraticCurveTo(points[i - 1].x, points[i - 1].y, xc, yc);
    }
    ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
    ctx.stroke();

    // Reset shadow values for dots
    ctx.shadowBlur = 0;
    
    // Draw coordinates data dots
    points.forEach(pt => {
        ctx.fillStyle = '#7c3aed';
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Draw date text on x axis
        ctx.fillStyle = 'var(--text-secondary)';
        ctx.font = 'Outfit, system-ui, sans-serif';
        ctx.fontSize = 10;
        ctx.textAlign = 'center';
        
        const dateObj = new Date(pt.dateStr);
        const dayLabel = `${dateObj.getDate()}/${dateObj.getMonth() + 1}`;
        ctx.fillText(dayLabel, pt.x, height - 10);
    });

    // Draw Y axis labels
    ctx.fillStyle = 'var(--text-muted)';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText("High ✨", paddingLeft - 8, paddingTop + 6);
    ctx.fillText("Mid 🧘", paddingLeft - 8, paddingTop + (chartHeight / 2) + 4);
    ctx.fillText("Low 😭", paddingLeft - 8, height - paddingBottom);
}

function drawMockChart(ctx, width, height) {
    // Generate beautiful mockup trend curves
    const paddingLeft = 40;
    const paddingBottom = 30;
    
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    
    const points = [
        { x: paddingLeft, y: height * 0.7 },
        { x: width * 0.2, y: height * 0.65 },
        { x: width * 0.4, y: height * 0.4 },
        { x: width * 0.6, y: height * 0.5 },
        { x: width * 0.8, y: height * 0.25 },
        { x: width - 20, y: height * 0.15 }
    ];

    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
        const xc = (points[i - 1].x + points[i].x) / 2;
        const yc = (points[i - 1].y + points[i].y) / 2;
        ctx.quadraticCurveTo(points[i - 1].x, points[i - 1].y, xc, yc);
    }
    ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
    ctx.stroke();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.font = '500 13px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText("Log 2 Check-ins to Unlock Interactive Mood Graph ✨", width / 2, height / 2 + 5);
}

// Simulated Achievement chime sounds
function playCalmingChime() {
    if (!state.soundEffects) return;
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        
        // G-Major pentatonic double chime sequence
        const playTone = (freq, start, duration) => {
            const osc = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            
            osc.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            
            osc.frequency.setValueAtTime(freq, start);
            gainNode.gain.setValueAtTime(0.12, start);
            gainNode.gain.exponentialRampToValueAtTime(0.0001, start + duration);
            
            osc.start(start);
            osc.stop(start + duration);
        };

        const now = audioCtx.currentTime;
        playTone(392, now, 0.6); // G4
        playTone(587.33, now + 0.15, 0.8); // D5
        playTone(880, now + 0.3, 1.2); // A5 (Pro Member spike chime!)
    } catch(err) {
        console.warn("Calming chime not supported by browser security policy.", err);
    }
}

// ==========================================================================
// GLOBAL INITIALIZER REGISTRIES & AUDITS
// ==========================================================================
function setupEventListeners() {
    setupTabRouting();

    // Pro checkout selects
    initPricingTab();
    setupPaymentModal();

    // Daily checks modal setup
    setupDailyCheckin();

    // Chart toggles binds
    const btn7d = document.getElementById('btn-chart-7d');
    const btn30d = document.getElementById('btn-chart-30d');

    if (btn7d && btn30d) {
        btn7d.addEventListener('click', () => {
            btn7d.classList.add('active');
            btn30d.classList.remove('active');
            activeChartDays = 7;
            drawMoodChart();
        });
        btn30d.addEventListener('click', () => {
            btn30d.classList.add('active');
            btn7d.classList.remove('active');
            activeChartDays = 30;
            drawMoodChart();
        });
    }

    // Emergency trigger
    const temptBtn = document.getElementById('btn-temptation-trigger');
    if (temptBtn) {
        temptBtn.addEventListener('click', openTemptationMode);
    }

    // Close emergency
    const closeTempt = document.getElementById('btn-close-temptation');
    if (closeTempt) {
        closeTempt.addEventListener('click', closeTemptationMode);
    }

    // Burn Message
    const burnBtn = document.getElementById('btn-burn-message');
    if (burnBtn) {
        // Clear old listener
        const newBurn = burnBtn.cloneNode(true);
        burnBtn.parentNode.replaceChild(newBurn, burnBtn);
        newBurn.addEventListener('click', () => {
            const textarea = document.getElementById('unsent-message-input');
            const msgVal = textarea.value.trim();

            if (!msgVal) {
                showToast("Empty Rant", "Please write down your feelings before burning the message.", "warning");
                return;
            }

            state.temptationsDefeated++;
            saveState();
            updateAchievements();

            // Burn effect anim
            textarea.style.transition = 'all 1s ease-out';
            textarea.style.transform = 'scale(0.8) rotate(3deg)';
            textarea.style.opacity = '0';
            textarea.style.filter = 'blur(10px) brightness(3)';

            setTimeout(() => {
                showToast("Evidence Burnt 🔥", "Unsent letter incinerated successfully. Cravings released!", "success");
                
                textarea.value = '';
                textarea.style.transform = 'scale(1) rotate(0deg)';
                textarea.style.opacity = '1';
                textarea.style.filter = 'none';
                
                closeTemptationMode();
                switchTab('dashboard');
                
                playCalmingChime();
            }, 1200);
        });
    }

    // Next Affirmation Card
    const nextAff = document.getElementById('btn-next-affirmation');
    if (nextAff) {
        nextAff.addEventListener('click', () => displayAffirmation(true));
    }

    // Share Affirmation Card
    const shareAff = document.getElementById('btn-share-affirmation');
    if (shareAff) {
        shareAff.addEventListener('click', () => {
            const affText = document.getElementById('dashboard-affirmation').innerText;
            navigator.clipboard.writeText(affText).then(() => {
                showToast("Tea Shared 🍵", "Affirmation copied to clipboard! Share it with the group chats.", "success");
            }).catch(err => {
                console.error("Clipboard copy failed: ", err);
            });
        });
    }

    // Sidebar Upgrade trigger binds
    const sidebarUpgradeBtn = document.getElementById('btn-upgrade-pro-sidebar');
    if (sidebarUpgradeBtn) {
        sidebarUpgradeBtn.addEventListener('click', () => {
            switchTab('pricing');
        });
    }

    const upgradeTriggers = document.querySelectorAll('.btn-upgrade-pro');
    upgradeTriggers.forEach(btn => {
        btn.addEventListener('click', () => {
            const pModal = document.getElementById('paywall-modal');
            if (pModal) {
                pModal.classList.remove('active-view');
                pModal.classList.add('hidden-view');
            }
            switchTab('pricing');
        });
    });

    // Add quick actions trigger navigation binds
    document.querySelectorAll('.nav-trigger').forEach(trigger => {
        trigger.addEventListener('click', () => {
            const target = trigger.getAttribute('data-target');
            switchTab(target);
        });
    });

    // Sub-view component setups
    initChatSubmit();
    setupArticleModal();
    setupCommentsDrawer();
}

// --- OVERRIDE GLOBAL TAB SWITCH ROUTINES FOR V2.0 ---
function switchTab(tabName) {
    document.querySelectorAll('.nav-item, .bottom-nav-item').forEach(item => {
        if (item.getAttribute('data-tab') === tabName) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active-tab');
        tab.classList.add('hidden-tab');
    });

    const targetTab = document.getElementById(`tab-${tabName}`);
    if (targetTab) {
        targetTab.classList.remove('hidden-tab');
        targetTab.classList.add('active-tab');
    }

    const pageTitle = document.getElementById('page-title');
    if (pageTitle) {
        // Visual text override
        const visualTitles = {
            dashboard: "Unclowned Dashboard 👑",
            therapist: "Scientific Tea Coach 🧠",
            journal: "My Era Logs 📝",
            community: "Support safety net 🫂",
            plan: "30-Day Recovery Roadmap 📅",
            blogs: "Breakup Trends & Tea 🧪",
            meditation: "Guided Zen Player 🧘",
            settings: "Settings Panel ⚙️",
            pricing: "Glow-Up Membership 👑"
        };
        pageTitle.innerText = visualTitles[tabName] || (tabName.charAt(0).toUpperCase() + tabName.slice(1));
    }

    // Specific component initializers
    if (tabName === 'dashboard') {
        initDashboard();
        drawMoodChart();
    } else if (tabName === 'journal') {
        renderJournalHistory();
    } else if (tabName === 'community') {
        renderCommunityPosts();
    } else if (tabName === 'plan') {
        renderPlanCalendar();
    } else if (tabName === 'blogs') {
        initBlogsTab();
    } else if (tabName === 'meditation') {
        initMeditationTab();
    } else if (tabName === 'settings') {
        initSettingsTab();
    } else if (tabName === 'pricing') {
        initPricingTab();
    }
}

// Add state load audits to enforce UI upgrade on initialization
const originalInitApp = initApp;
initApp = function() {
    originalInitApp();
    if (state.hasStarted && state.startDate) {
        updateSubscriptionUI();
        drawMoodChart();
    }
};
