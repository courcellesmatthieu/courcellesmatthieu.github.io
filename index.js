const copyTextToClipboard = async (text) => {
  text = text.replace('mailto:', '');

  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.error('Failed to copy text: ', err);
      return false;
    }
  } else {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      document.execCommand?.('copy');
      document.body.removeChild(textArea);
      return true;
    } catch (err) {
      console.error('Failed to copy text: ', err);
      return false;
    }
  }
};

document.querySelectorAll('a[href^="mailto"]').forEach(link => link.addEventListener('click', (e) => {
  if(copyTextToClipboard(link.href)) {
    e.preventDefault();
    alert('Email copié dans votre presse-papier')
  }
}))