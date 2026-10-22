/* ==========================================================================
   TRAVEL MATE — Manage Contact Inquiries Logic
   ========================================================================== */

let tmMessagesList = [];
let tmMessageModal = null;
let tmCurrentActiveMessageId = null;

function tmEscapeHtml(str) {
  if (str === null || str === undefined) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function tmShowModal() {
  const modalEl = document.getElementById("messageModal");
  if (!modalEl) return;

  if (typeof bootstrap !== "undefined" && bootstrap.Modal) {
    try {
      if (!tmMessageModal) {
        tmMessageModal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
      }
      tmMessageModal.show();
      return;
    } catch (e) {
      console.warn("Bootstrap modal show warning:", e);
    }
  }

  // Fallback if bootstrap JS is not loaded
  modalEl.classList.add("show");
  modalEl.style.display = "block";
  modalEl.removeAttribute("aria-hidden");
  modalEl.setAttribute("aria-modal", "true");
  let backdrop = document.querySelector(".modal-backdrop");
  if (!backdrop) {
    backdrop = document.createElement("div");
    backdrop.className = "modal-backdrop fade show";
    document.body.appendChild(backdrop);
  }
  document.body.classList.add("modal-open");
}

function tmHideModal() {
  const modalEl = document.getElementById("messageModal");
  if (!modalEl) return;

  if (tmMessageModal) {
    try {
      tmMessageModal.hide();
    } catch (e) {}
  }

  modalEl.classList.remove("show");
  modalEl.style.display = "none";
  modalEl.setAttribute("aria-hidden", "true");
  modalEl.removeAttribute("aria-modal");

  const backdrops = document.querySelectorAll(".modal-backdrop");
  backdrops.forEach((b) => b.remove());

  document.body.classList.remove("modal-open");
  document.body.style.removeProperty("overflow");
  document.body.style.removeProperty("padding-right");
}

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
    tableBody.innerHTML = `<tr><td colspan="5" class="text-center py-4 text-danger">Failed to retrieve contact messages.</td></tr>`;
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
  const filterEl = document.getElementById("msgFilterStatus");
  const filter = filterEl ? filterEl.value : "all";
  if (!tableBody) return;

  let list = [...tmMessagesList];
  if (filter === "unread") {
    list = list.filter((m) => !m.isRead && !m.read);
  } else if (filter === "read") {
    list = list.filter((m) => m.isRead || m.read);
  }

  const countEl = document.getElementById("msgCount");
  if (countEl) countEl.textContent = `(${tmMessagesList.length})`;

  if (!list.length) {
    tableBody.innerHTML = `<tr><td colspan="5" class="text-center py-4 text-muted">No messages found matching filter criteria.</td></tr>`;
    return;
  }

  tableBody.innerHTML = list
    .map((m) => {
      const isUnread = !m.isRead && !m.read;
      const dateStr = m.createdAt ? new Date(m.createdAt).toLocaleString() : "Recent";
      return `
      <tr class="${isUnread ? 'table-warning-subtle fw-semibold' : ''}" data-row-id="${m.id}">
        <td>
          ${
            isUnread
              ? `<span class="badge bg-warning text-dark"><i class="bi bi-envelope-fill me-1"></i> New</span>`
              : `<span class="badge bg-light text-muted border"><i class="bi bi-envelope-open me-1"></i> Read</span>`
          }
        </td>
        <td>
          <span class="text-dark d-block fw-bold">${tmEscapeHtml(m.name)}</span>
          <small class="text-muted">${tmEscapeHtml(m.email)}</small>
        </td>
        <td>
          <a href="#" class="text-decoration-none text-dark fw-semibold" data-view-id="${m.id}">
            ${tmEscapeHtml(m.subject)}
          </a>
        </td>
        <td class="small text-muted">${dateStr}</td>
        <td class="text-end">
          <button class="btn btn-sm btn-outline-primary me-1" data-view-id="${m.id}" title="View inquiry">
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
      const id = btn.getAttribute("data-view-id");
      tmOpenMessageModal(id);
    });
  });

  tableBody.querySelectorAll("[data-del-id]").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      e.preventDefault();
      const id = btn.getAttribute("data-del-id");
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
  const m = tmMessagesList.find((x) => String(x.id) === String(id));
  if (!m) return;
  tmCurrentActiveMessageId = m.id;

  const senderNameEl = document.getElementById("mSenderName");
  if (senderNameEl) senderNameEl.textContent = m.name || "--";

  const emailLink = document.getElementById("mSenderEmail");
  if (emailLink) {
    emailLink.textContent = m.email || "--";
    emailLink.href = m.email ? `mailto:${m.email}` : "#";
  }

  const dateEl = document.getElementById("mReceivedDate");
  if (dateEl) {
    dateEl.textContent = m.createdAt
      ? new Date(m.createdAt).toLocaleString()
      : "Recent";
  }

  const subjEl = document.getElementById("mSubject");
  if (subjEl) subjEl.textContent = m.subject || "--";

  const contentEl = document.getElementById("mContent");
  if (contentEl) contentEl.textContent = m.message || "--";

  const replyBtn = document.getElementById("mReplyBtn");
  if (replyBtn) {
    replyBtn.href = m.email
      ? `mailto:${m.email}?subject=Re: ${encodeURIComponent(m.subject || "Your Inquiry")}`
      : "#";
  }

  // Mark as read if currently unread
  if (!m.isRead && !m.read) {
    try {
      await TM_API.markMessageRead(m.id);
      m.isRead = true;
      m.read = true;
      tmUpdateUnreadBadge();

      // Update the visual row in place so it shows "Read"
      const row = document.querySelector(`tr[data-row-id="${m.id}"]`);
      if (row) {
        row.classList.remove("table-warning-subtle", "fw-semibold");
        const statusCell = row.cells[0];
        if (statusCell) {
          statusCell.innerHTML = `<span class="badge bg-light text-muted border"><i class="bi bi-envelope-open me-1"></i> Read</span>`;
        }
      }
    } catch (err) {
      console.warn("Could not mark message as read:", err);
    }
  }

  tmShowModal();
}

document.addEventListener("DOMContentLoaded", () => {
  const modalEl = document.getElementById("messageModal");
  if (modalEl && typeof bootstrap !== "undefined" && bootstrap.Modal) {
    try {
      tmMessageModal = new bootstrap.Modal(modalEl);
    } catch (e) {
      console.warn("Bootstrap Modal init warning:", e);
    }
  }

  // Wire up close buttons
  document.querySelectorAll('[data-bs-dismiss="modal"]').forEach((btn) => {
    btn.addEventListener("click", tmHideModal);
  });

  if (modalEl) {
    modalEl.addEventListener("click", (e) => {
      if (e.target === modalEl) tmHideModal();
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") tmHideModal();
  });

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
        tmHideModal();
        tmToast("Message deleted successfully", "success");
        await tmLoadMessages();
      } catch (err) {
        tmToast(err.message || "Failed to delete message", "error");
      }
    });
  }

  tmLoadMessages();
});
