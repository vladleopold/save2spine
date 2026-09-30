import React, { useEffect, useRef } from 'react';
import { Media } from './CardRotator.jsx';
import { registerVideo } from './autoPlay.js';

/**
 * Медиа внутри попапа статьи.
 *
 * Ролики попапа живут в отдельной группе: пока попап открыто, галерея на фоне
 * замолкает, а здесь играет всё, что попало в кадр. Запуск и остановку делает
 * общий менеджер autoPlay — компонент только подписывается и отписывается.
 */
export default function PopupMedia({ src, alt, ...rest }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return undefined;
    return registerVideo(ref.current, { group: 'popup' });
  }, [src]);

  // loop: в попапе нет ленты кадров, поэтому ролик должен повторяться сам,
  // иначе он доиграет и замрёт на последнем кадре.
  return <Media mediaRef={(el) => { ref.current = el; }} src={src} alt={alt} preload="none" loop {...rest} />;
}
