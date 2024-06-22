function tooltip(element) {
  // custom variables
  const timeoutDelay = 500;
  const transition = 150;
  const translateDistance = 16; /* in pixels to make position more accurate */
  const maxWidth = ['90vw', '25ch'];

  const defaultStyles = {
    "position": "absolute",
    "width": "max-content",
    "pointer-events": "none",
    "visibility": "hidden",
    "opacity": 0,
    "z-index": 10,
    "transition-property": "opacity, visibility, transform"
  }

  let timeout = setTimeout(() => {
    if (!element.querySelector('.tooltip-text')) {
      // get tooltip text
      const text = element.getAttribute('aria-describedby');

      // create tooltipText
      const tooltipText = document.createElement('div');
      tooltipText.classList.add('tooltip-text');
      tooltipText.textContent = text;

      // add default styles
      for (const style in defaultStyles) {
        tooltipText.style[style] = defaultStyles[style];
      }

      // add custom styles
      tooltipText.style.maxWidth = `min(${maxWidth[0]},${maxWidth[1]})`;
      tooltipText.style.transitionDuration = `${transition}ms`;

      // append tooltipText to element
      element.appendChild(tooltipText);

      // get position styles
      const styles = tooltipPosition(element, tooltipText, translateDistance);

      // loop through and apply position styles
      for (const style in styles) {
        if (style != 'transform') {
          tooltipText.style[style] = styles[style];
        }
      }

      // show tooltip
      tooltipText.style.pointerEvents = 'inherit';
      tooltipText.style.visibility = 'visible';
      tooltipText.style.opacity = '1';
      // tooltipText.classList.add('show');

      // update tooltip position
      tooltipText.style['transform'] = styles['transform'];
    }
  }, timeoutDelay);

  // hide and remove tooltip
  element.addEventListener('mouseleave', function hideTooltip() {

    // clear timeout if it exists
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }

    // remove tooltip if it exists
    if (this.querySelector('.tooltip-text')) {
      const tooltipText = this.querySelector('.tooltip-text');
      // tooltipText.classList.remove('show');
      tooltipText.style.pointerEvents = 'none';
      tooltipText.style.visibility = 'hidden';
      tooltipText.style.opacity = '0';
      tooltipText.style.transform = '';

      // wait for transition to finish
      setTimeout(() => {
        tooltipText.remove();
        this.removeEventListener('mouseleave', hideTooltip);
      }, transition);
    }

  });

}


function tooltipPosition(tooltip, tooltipText, translateDistance) {
  const vh = window.innerHeight;
  const vw = window.innerWidth;
  const tipPos = tooltip.getBoundingClientRect();
  const tipHalfWidth = tipPos.width / 2;
  const textPos = tooltipText.getBoundingClientRect();
  const textHalfWidth = textPos.width / 2;

  let styles = {};
  let x;
  let y;

  // x position
  if (tipPos.x + tipHalfWidth < vw - textHalfWidth && tipPos.x + tipHalfWidth > textHalfWidth) {
    x = 'middle';
  } else if (tipPos.x + tipHalfWidth > vw - textPos.width) {
    x = 'right';
  } else if (tipPos.x + tipHalfWidth < textPos.width) {
    x = 'left';
  }

  // y position
  if (tipPos.y < textPos.height + translateDistance) {
    y = 'top';
  } else if (tipPos.y + tipPos.height > vh - textPos.height) {
    y = 'bottom';
  } else {
    y = 'middle';
  }

  // set position
  const position = `${y}-${x}`;

  // set styles
  switch (position) {
    case 'top-left':
      styles.left = "0";
      styles.top = "100%";
      styles.transform = `translateY(${translateDistance}px)`;
      break;
    case 'top-middle':
      styles.left = "50%";
      styles.top = "100%";
      styles.translate = "-50% 0%";
      styles.transform = `translateY(${translateDistance}px)`;
      break;
    case 'top-right':
      styles.right = "0";
      styles.top = "100%";
      styles.transform = `translateY(${translateDistance}px)`;
      break;
    case 'middle-left':
    case 'bottom-left':
      styles.left = "0";
      styles.bottom = "100%";
      styles.transform = `translateY(-${translateDistance}px)`;
      break;
    case 'middle-middle':
    case 'bottom-middle':
      styles.left = "50%";
      styles.bottom = "100%";
      styles.translate = "-50% 0%";
      styles.transform = `translateY(-${translateDistance}px)`;
      break;
    case 'middle-right':
    case 'bottom-right':
      styles.right = "0";
      styles.bottom = "100%";
      styles.transform = `translateY(-${translateDistance}px)`;
      break;
  }
  return styles;
}