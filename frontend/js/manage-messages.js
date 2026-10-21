/* ==========================================================================
   TRAVEL MATE — Manage Contact Inquiries Logic
   ========================================================================== */

let tmMessagesList = [];
let tmMessageModal = null;
let tmCurrentActiveMessageId = null;

async function tmLoadMessages() {
  const tableBody = document.getElementById("messagesTableBody");
  const countEl = document.getElementById("msgCount");
  if (!tableBody) return;

  try {
    tmMessagesList = await TM_API.getContactMessages();
    if (countEl) countEl.textContent = `(${tmMessagesList.length})`;

    tmUpdateUnreadBadge();
    tmRenderFilteredMessages();
  } catch (err) {
    console.error("Failed to load contact messages:", err);
    tableBody.innerHTML = `<tr><td colspan="5" class="text-center py-4 text-danger">Failed to retrieve contact messages from server.</td></tr>`;
  }
}

function tmUpdateUnreadBadge() {
  const unreadCount = tmMessagesList.filter((m) => !m.isRead && !m.read).length;
  const badge = document.getElementById("sideUnreadBadge");
  if (badge) {
    if (unreadCount > 0) {
      badge.textContent = unreadCount;
      badge.style.display = "inline-block";
    } else {
      badge.style.display = "none";
    }
  }
}

function tmRenderFilteredMessages() {
  const tableBody = document.getElementById("messagesTableBody");
  const filter = document.getElementById("msgFilterStatus").value;
  if (!tableBody) return;

  let list = [...tmMessagesList];
  if (filter === "unread") {
    list = list.filter((m) => !m.isRead && !m.read);
  } else if (filter === "read") {
    list = list.filter((m) => m.isRead || m.read);
  }

  if (!list.length) {
    tableBody.innerHTML = `<tr><td colspan="5" class="text-center py-4 text-muted">No messages found matching filter criteria.</td></tr>`;
    return;
  }

  tableBody.innerHTML = list
    .map((m) => {
      const isUnread = !m.isRead && !m.read;
      const dateStr = m.createdAt ? new Date(m.createdAt).toLocaleString() : "Recent";
      return `
      <tr class="${isUnread ? 'table-warning-subtle fw-semibold' : ''}">
        <td>
          ${
            isUnread
              ? `<span class="badge bg-warning text-dark"><i class="bi bi-envelope-fill me-1"></i> New</span>`
              : `<span class="badge bg-light text-muted border"><i class="bi bi-envelope-open me-1"></i> Read</span>`
          }
        </td>
        <td>
          <span class="text-dark d-block">${m.name}</span>
          <small class="text-muted">${m.email}</small>
        </td>
        <td>
          <a href="#" class="text-decoration-none text-dark" data-view-id="${m.id}">
            ${m.subject}
          </a>
        </td>
        <td class="small text-muted">${dateStr}</td>
        <td class="text-end">
          <button class="btn btn-sm btn-outline-primary me-1" data-view-id="${m.id}" title="View details">
            <i class="bi bi-eye"></i>
          </button>
          <button class="btn btn-sm btn-outline-danger" data-del-id="${m.id}" title="Delete inquiry">
            <i class="bi bi-trash"></i>
          </button>
        </td>
      </tr>`;
    })
    .join("");

  tableBody.querySelectorAll("[data-view-id]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const id = Number(btn.getAttribute("data-view-id"));
      tmOpenMessageModal(id);
    });
  });

  tableBody.querySelectorAll("[data-del-id]").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      e.preventDefault();
      const id = Number(btn.getAttribute("data-del-id"));
      if (!confirm("Are you sure you want to delete this message?")) return;
      try {
        await TM_API.deleteContactMessage(id);
        tmToast("Message deleted successfully", "success");
        await tmLoadMessages();
      } catch (err) {
        tmToast(err.message || "Failed to delete message", "error");
      }
    });
  });
}

async function tmOpenMessageModal(id) {
  const m = tmMessagesList.find((x) => x.id === id);
  if (!m) return;
  tmCurrentActiveMessageId = id;

  document.getElementById("mSenderName").textContent = m.name;
  const emailLink = document.getElementById("mSenderEmail");
  emailLink.textContent = m.email;
  emailLink.href = `mailto:${m.email}`;

  document.getElementById("mReceivedDate").textContent = m.createdAt
    ? new Date(m.createdAt).toLocaleString()
    : "Recent";
  document.getElementById("mSubject").textContent = m.subject;
  document.getElementById("mContent").textContent = m.message;

  const replyBtn = document.getElementById("mReplyBtn");
  if (replyBtn) {
    replyBtn.href = `mailto:${m.email}?subject=Re: ${encodeURIComponent(m.subject)}`;
  }

  // Mark as read if currently unread
  if (!m.isRead && !m.read) {
    try {
      await TM_API.markMessageRead(id);
      m.isRead = true;
      m.read = true;
      tmUpdateUnreadBadge();
      tmRenderFilteredMessages();
    } catch (err) {
      console.warn("Could not mark message as read on server:", err);
    }
  }

  if (tmMessageModal) tmMessageModal.show();
}

document.addEventListener("DOMContentLoaded", () => {
  const modalEl = document.getElementById("messageModal");
  if (modalEl) tmMessageModal = new bootstrap.Modal(modalEl);

  const filterSelect = document.getElementById("msgFilterStatus");
  if (filterSelect) {
    filterSelect.addEventListener("change", tmRenderFilteredMessages);
  }

  const refreshBtn = document.getElementById("refreshMessagesBtn");
  if (refreshBtn) {
    refreshBtn.addEventListener("click", () => {
      tmLoadMessages();
      tmToast("Inquiries refreshed", "info");
    });
  }

  const deleteBtnInModal = document.getElementById("mDeleteBtn");
  if (deleteBtnInModal) {
    deleteBtnInModal.addEventListener("click", async () => {
      if (!tmCurrentActiveMessageId) return;
      if (!confirm("Are you sure you want to delete this message?")) return;
      try {
        await TM_API.deleteContactMessage(tmCurrentActiveMessageId);
        if (tmMessageModal) tmMessageModal.hide();
        tmToast("Message deleted", "success");
        await tmLoadMessages();
      } catch (err) {
        tmToast(err.message || "Failed to delete message", "error");
      }
    });
  }

  tmLoadMessages();
});
