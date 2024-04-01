import create from 'zustand';

type tweetCircleStore = {
  tweetCircle: string[] | null;
  setTweetCircle: (tweetCircle: string[]) => void;
};

type mentionStore = {
  mention: string[] | null;
  setMention: (mention: string[]) => void;
};

export const useTweetCircleStore = create<tweetCircleStore>((set) => ({
  tweetCircle: [],
  setTweetCircle: (newTweetCircle) => {
    set({ tweetCircle: newTweetCircle });
  },
}));

export const useMentionStore = create<mentionStore>((set) => ({
  mention: [],
  setMention: (newMention) => {
    set({ mention: newMention });
  },
}));


