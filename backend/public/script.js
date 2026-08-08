// ==========================================================================
// ABTalks Single Page Application (SPA) Frontend Engine
// ==========================================================================

const state = {
  currentRoute: '/',
  dashboardData: null,
  currentDayTask: null,
  currentDayNumber: 12
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  handleRouting();

  // Listen to browser navigation back/forward
  window.addEventListener('popstate', () => {
    handleRouting();
  });
});

// Client-Side Router
function navigateTo(path) {
  window.history.pushState({}, '', path);
  handleRouting();
}

function handleRouting() {
  const path = window.location.pathname;
  state.currentRoute = path;

  // Hide all views
  document.querySelectorAll('.view').forEach(el => el.classList.add('hidden'));

  if (path.startsWith('/day/')) {
    const dayNum = parseInt(path.replace('/day/', ''), 10) || 12;
    state.currentDayNumber = dayNum;
    document.getElementById('view-day').classList.remove('hidden');
    loadDayTaskView(dayNum);
  } else if (path === '/dashboard') {
    document.getElementById('view-dashboard').classList.remove('hidden');
    loadDashboardView();
  } else {
    document.getElementById('view-landing').classList.remove('hidden');
    loadLandingView();
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// --------------------------------------------------------------------------
// 1. LANDING PAGE VIEW
// --------------------------------------------------------------------------
async function loadLandingView() {
  try {
    const res = await fetch('/api/stats');
    const data = await res.json();

    if (data.totalParticipants) {
      document.getElementById('stat-participants').textContent = `${data.totalParticipants.toLocaleString()}+`;
      document.getElementById('stat-badge-text').textContent = `${data.totalParticipants.toLocaleString()}+ Indian Tech Students Enrolled`;
    }
    if (data.completionRate) {
      document.getElementById('stat-completion').textContent = `${data.completionRate}%`;
    }

    if (data.testimonials && data.testimonials.length > 0) {
      const testimonialsContainer = document.getElementById('testimonials-list');
      testimonialsContainer.innerHTML = data.testimonials.map(t => `
        <div class="testimonial-card">
          <p class="testimonial-quote">"${t.quote}"</p>
          <div class="testimonial-author">
            <span class="author-name">${t.name}</span>
            <span class="author-college">${t.college || 'Engineering Student'}</span>
          </div>
        </div>
      `).join('');
    }
  } catch (err) {
    console.error('Error loading stats:', err);
  }
}

// --------------------------------------------------------------------------
// 2. DASHBOARD VIEW
// --------------------------------------------------------------------------
async function loadDashboardView() {
  try {
    const res = await fetch('/api/dashboard');
    const data = await res.json();
    state.dashboardData = data;

    // Update Header / User Banner
    document.getElementById('user-name').textContent = data.user.name;
    document.getElementById('user-avatar').src = data.user.avatar;
    document.getElementById('user-track').textContent = data.track.name;
    document.getElementById('user-streak').textContent = data.streak;

    // Progress Bar
    const progress = data.progress;
    document.getElementById('progress-text').textContent = `${progress.percentage}%`;
    document.getElementById('progress-fill').style.width = `${progress.percentage}%`;
    document.getElementById('completed-count').textContent = `${progress.completed} of ${progress.total} Days Completed`;

    // Today's Task Spotlight
    const today = data.today_task;
    document.getElementById('today-day-tag').textContent = `Day ${today.day}`;
    document.getElementById('today-task-title').textContent = today.title;
    
    const statusBadge = document.getElementById('today-status-badge');
    if (data.has_submitted_today) {
      statusBadge.textContent = 'Status: Submitted ✓';
      statusBadge.className = 'status-badge completed';
    } else {
      statusBadge.textContent = 'Status: Pending Submission';
      statusBadge.className = 'status-badge pending';
    }

    document.getElementById('btn-view-today').onclick = () => navigateTo(`/day/${today.day}`);

    // Render Achievements
    const achievementsGrid = document.getElementById('achievements-grid');
    if (data.achievements && data.achievements.length > 0) {
      achievementsGrid.innerHTML = data.achievements.map(a => `
        <div class="achievement-card">
          <span class="achievement-icon">${a.icon}</span>
          <span class="achievement-name">${a.name}</span>
        </div>
      `).join('');
    } else {
      achievementsGrid.innerHTML = `<p style="font-size: 0.8rem; color: var(--text-subtle);">Complete daily tasks to unlock badges!</p>`;
    }

    // Render 60-Day Grid
    renderCalendarGrid(data.progress.completed, data.track.current_day);

  } catch (err) {
    console.error('Error loading dashboard:', err);
  }
}

function renderCalendarGrid(completedCount, currentDay) {
  const grid = document.getElementById('days-calendar-grid');
  grid.innerHTML = '';

  for (let d = 1; d <= 60; d++) {
    const dayBox = document.createElement('div');
    dayBox.className = 'day-box';
    
    if (d <= completedCount) {
      dayBox.classList.add('completed');
      dayBox.innerHTML = `<span>✓</span><span style="font-size:0.7rem">${d}</span>`;
    } else if (d === currentDay) {
      dayBox.classList.add('active');
      dayBox.textContent = `Day ${d}`;
    } else {
      dayBox.textContent = d;
    }

    dayBox.onclick = () => navigateTo(`/day/${d}`);
    grid.appendChild(dayBox);
  }
}

// --------------------------------------------------------------------------
// 3. DAY TASK VIEW
// --------------------------------------------------------------------------
async function loadDayTaskView(dayNumber) {
  try {
    const res = await fetch(`/api/day/${dayNumber}`);
    const task = await res.json();
    state.currentDayTask = task;

    document.getElementById('task-day-num').textContent = `Day ${task.day}`;
    document.getElementById('task-title').textContent = task.title;
    document.getElementById('task-description').textContent = task.description;

    const statusPill = document.getElementById('task-status-pill');
    const isSubmitted = !!task.submission?.submitted_at;

    if (isSubmitted) {
      statusPill.textContent = 'Completed ✓';
      statusPill.className = 'task-status-pill completed';
    } else {
      statusPill.textContent = 'Pending Submission';
      statusPill.className = 'task-status-pill pending';
    }

    // Requirements List
    const reqList = document.getElementById('task-requirements');
    if (task.requirements && task.requirements.length > 0) {
      reqList.innerHTML = task.requirements.map(req => `<li>${req}</li>`).join('');
    } else {
      reqList.innerHTML = `<li>Complete and verify the code logic for Day ${dayNumber}</li>`;
    }

    // Resources Grid
    const resGrid = document.getElementById('task-resources');
    if (task.resources && task.resources.length > 0) {
      resGrid.innerHTML = task.resources.map(r => `
        <a href="${r.url}" target="_blank" rel="noopener noreferrer" class="resource-link">
          <span>${r.type === 'video' ? '📺' : '📚'}</span>
          <span>${r.title}</span>
        </a>
      `).join('');
    } else {
      resGrid.innerHTML = `<p style="font-size:0.8rem; color:var(--text-subtle);">No external resources required for this challenge.</p>`;
    }

    // Submission Form prefill
    document.getElementById('input-github').value = task.submission?.github_url || '';
    document.getElementById('input-linkedin').value = task.submission?.linkedin_url || '';

    const alertBox = document.getElementById('submit-alert');
    alertBox.classList.add('hidden');

    if (isSubmitted) {
      alertBox.textContent = `Completed on ${new Date(task.submission.submitted_at).toLocaleDateString()}`;
      alertBox.className = 'alert alert-success';
      alertBox.classList.remove('hidden');
    }

  } catch (err) {
    console.error('Error loading task details:', err);
  }
}

// Handle Task Submission
async function handleSubmission(event) {
  event.preventDefault();
  const day = state.currentDayNumber;
  const github_url = document.getElementById('input-github').value.trim();
  const linkedin_url = document.getElementById('input-linkedin').value.trim();
  const alertBox = document.getElementById('submit-alert');
  const btn = document.getElementById('btn-submit-task');

  if (!github_url || !linkedin_url) {
    alertBox.textContent = 'Please provide both GitHub and LinkedIn URLs';
    alertBox.className = 'alert alert-error';
    alertBox.classList.remove('hidden');
    return;
  }

  try {
    btn.disabled = true;
    btn.textContent = 'Submitting...';

    const res = await fetch(`/api/day/${day}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ github_url, linkedin_url })
    });

    const data = await res.json();

    if (data.success) {
      alertBox.textContent = 'Proof of work submitted successfully! 🎉 Streak updated!';
      alertBox.className = 'alert alert-success';
      alertBox.classList.remove('hidden');

      const statusPill = document.getElementById('task-status-pill');
      statusPill.textContent = 'Completed ✓';
      statusPill.className = 'task-status-pill completed';
    } else {
      alertBox.textContent = data.error || 'Submission failed. Please try again.';
      alertBox.className = 'alert alert-error';
      alertBox.classList.remove('hidden');
    }
  } catch (err) {
    console.error('Error submitting:', err);
    alertBox.textContent = 'Server connection error. Please try again.';
    alertBox.className = 'alert alert-error';
    alertBox.classList.remove('hidden');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Submit & Complete Day 🚀';
  }
}