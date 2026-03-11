function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = msg;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 2200);
}

function fallbackCopyText(text) {
  const ta = document.createElement('textarea');
  ta.value = text;
  document.body.appendChild(ta);
  ta.select();
  document.execCommand('copy');
  document.body.removeChild(ta);
}

function copyAccount(num, btn) {
  navigator.clipboard.writeText(num).then(() => {
    if (btn) {
      btn.textContent = '복사됨';
      btn.classList.add('copied');

      setTimeout(() => {
        btn.textContent = '복사';
        btn.classList.remove('copied');
      }, 2000);
    }

    showToast('계좌번호가 복사되었습니다');
  }).catch(() => {
    fallbackCopyText(num);
    showToast('계좌번호가 복사되었습니다');
  });
}

function copyLink() {
  navigator.clipboard.writeText(window.location.href).then(() => {
    showToast('청첩장 링크가 복사되었습니다');
  }).catch(() => {
    fallbackCopyText(window.location.href);
    showToast('청첩장 링크가 복사되었습니다');
  });
}

window.copyAccount = copyAccount;
window.copyLink = copyLink;