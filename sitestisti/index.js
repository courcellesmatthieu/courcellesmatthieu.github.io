const copyTextToClipboard = async (text) => {
  const value = text.replace('mailto:', '');

  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(value);
      return true;
    } catch (err) {
      console.error('Failed to copy text: ', err);
      return false;
    }
  }

  const textArea = document.createElement('textarea');
  textArea.value = value;
  textArea.style.position = 'fixed';
  textArea.style.opacity = '0';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    document.execCommand?.('copy');
    return true;
  } catch (err) {
    console.error('Failed to copy text: ', err);
    return false;
  } finally {
    document.body.removeChild(textArea);
  }
};

document.querySelectorAll('a[href^="mailto"]').forEach(link => link.addEventListener('click', (e) => {
  if (copyTextToClipboard(link.href)) {
    e.preventDefault();
    alert('Email copie dans votre presse-papier');
  }
}));
