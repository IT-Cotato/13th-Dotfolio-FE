import { useLottie } from 'lottie-react';
import notesAnimation from '@/mock/notes.json';

export const NotesAnimation = () => {
  const { View } = useLottie({
      animationData: notesAnimation,
      loop: true,
    }, { width: 77, height: 80 });

  return <div role="img" aria-label="메모가 그려지는 애니메이션">{View}</div>;
};
