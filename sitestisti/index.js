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

const setupMailLinks = () => {
  document.querySelectorAll('a[href^="mailto"]').forEach(link => link.addEventListener('click', (e) => {
    if (copyTextToClipboard(link.href)) {
      e.preventDefault();
      alert('Email copié dans votre presse-papier');
    }
  }));
};

const isZoomableImage = (img) => {
  if (!img || img.dataset.noZoom === 'true') return false;

  const rawSrc = img.getAttribute('src') || '';
  const normalized = rawSrc.split('#')[0].split('?')[0].toLowerCase();
  const extension = normalized.split('.').pop();

  return ['jpg', 'jpeg', 'png', 'webp'].includes(extension);
};

const setupImageModal = () => {
  const clickableImages = Array.from(document.querySelectorAll('img')).filter(isZoomableImage);

  if (!clickableImages.length) {
    return;
  }

  const modal = document.createElement('div');
  modal.className = 'image-modal';
  modal.innerHTML = `
    <div class="image-modal__content" role="dialog" aria-modal="true" aria-label="Apercu de l'image">
      <button type="button" class="image-modal__close" aria-label="Fermer l'apercu">X</button>
      <img class="image-modal__img" alt="">
    </div>
  `;

  const modalImage = modal.querySelector('.image-modal__img');
  const closeButton = modal.querySelector('.image-modal__close');

  const closeModal = () => {
    modal.classList.remove('is-open');
    document.body.classList.remove('modal-open');
    modalImage.src = '';
    modalImage.alt = '';
    modalImage.dataset.zoomSize = '';
    modalImage.style.transform = '';
  };

  const openModal = (img) => {
    modalImage.src = img.src;
    modalImage.alt = img.alt || '';
    const zoomSize = img.dataset.zoomSize || 'default';
    modalImage.dataset.zoomSize = zoomSize;
    const computedTransform = window.getComputedStyle(img).transform;
    modalImage.style.transform = computedTransform !== 'none' ? computedTransform : '';
    modal.classList.add('is-open');
    document.body.classList.add('modal-open');
  };

  clickableImages.forEach((img) => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', (event) => {
      event.preventDefault();
      openModal(img);
    });
  });

  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  closeButton.addEventListener('click', closeModal);

  document.addEventListener('keyup', (event) => {
    if (event.key === 'Escape' && modal.classList.contains('is-open')) {
      closeModal();
    }
  });

  document.body.appendChild(modal);
};

document.addEventListener('DOMContentLoaded', () => {
  setupMailLinks();
  setupImageModal();
});
