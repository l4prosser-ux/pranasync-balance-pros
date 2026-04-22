import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Audio } from 'expo-av';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import type { Exercise } from '@/data/exercises';
import THUMBNAILS from '@/data/thumbnails';

async function playGongSound() {
  try {
    await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
    const { sound } = await Audio.Sound.createAsync(
      require('../assets/gong.wav'),
      { shouldPlay: true, volume: 0.85 }
    );
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) sound.unloadAsync();
    });
  } catch (_) {}
}

const WIN = Dimensions.get('window');

interface Props {
  exercise: Exercise;
  index: number;
  phaseId: number;
  done: boolean;
  reps?: number;
  levelColor: string;
  levelBg: string;
  levelText: string;
  showReps: boolean;
  onToggleDone: () => void;
}

function fmt(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

function Timer({ seconds, gong }: { seconds: number; gong?: boolean }) {
  const colors = useColors();
  const [remaining, setRemaining] = useState(seconds);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isDone = remaining <= 0;

  const triggerCompletion = useCallback(() => {
    if (Platform.OS !== 'web') {
      if (gong) {
        // Heavy pulse haptic for gong exercises
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy), 350);
        setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium), 700);
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    }
    if (gong) playGongSound();
  }, [gong]);

  const start = useCallback(() => {
    if (running || isDone) return;
    setRunning(true);
    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setRunning(false);
          triggerCompletion();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [running, isDone, triggerCompletion]);

  const reset = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setRunning(false);
    setRemaining(seconds);
  }, [seconds]);

  // Secret creator mode: long-press the running timer to skip to completion
  const forceComplete = useCallback(() => {
    if (!running) return;
    if (intervalRef.current) clearInterval(intervalRef.current);
    setRunning(false);
    setRemaining(0);
    triggerCompletion();
  }, [running, triggerCompletion]);

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

  return (
    <View style={[styles.timerWrap, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
      <Pressable
        onLongPress={forceComplete}
        delayLongPress={600}
        disabled={!running}
      >
        <Text style={[
          styles.timerDisplay,
          { color: isDone ? colors.advanced : running ? colors.beginner : colors.foreground }
        ]}>
          {isDone ? 'Done!' : fmt(remaining)}
        </Text>
      </Pressable>
      <View style={styles.timerBtns}>
        <TouchableOpacity
          onPress={start}
          disabled={running || isDone}
          style={[styles.timerBtn, { borderColor: colors.border, opacity: (running || isDone) ? 0.4 : 1 }]}
        >
          <Feather name="play" size={13} color={colors.foreground} />
          <Text style={[styles.timerBtnText, { color: colors.foreground }]}>Start</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={reset}
          style={[styles.timerBtn, { borderColor: colors.border }]}
        >
          <Feather name="rotate-ccw" size={13} color={colors.foreground} />
          <Text style={[styles.timerBtnText, { color: colors.foreground }]}>Reset</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function ExerciseCard({
  exercise,
  done,
  reps,
  levelColor,
  levelBg,
  levelText,
  showReps,
  onToggleDone,
}: Props) {
  const colors = useColors();
  const [open, setOpen] = useState(false);
  const [lightbox, setLightbox] = useState(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const toggle = useCallback(() => {
    Animated.spring(rotateAnim, { toValue: open ? 0 : 1, useNativeDriver: true }).start();
    setOpen((v) => !v);
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, [open, rotateAnim]);

  const handleCheck = useCallback(() => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onToggleDone();
  }, [onToggleDone]);

  const openLightbox = useCallback(() => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setLightbox(true);
  }, []);

  const closeLightbox = useCallback(() => setLightbox(false), []);

  const rotate = rotateAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '90deg'] });
  const thumbSource = exercise.thumbnail ? THUMBNAILS[exercise.thumbnail] : null;

  return (
    <>
      {/* Full-screen lightbox */}
      {thumbSource && (
        <Modal
          visible={lightbox}
          transparent
          animationType="fade"
          statusBarTranslucent
          onRequestClose={closeLightbox}
        >
          {/* Dark backdrop — tap anywhere to close */}
          <Pressable style={styles.lbOverlay} onPress={closeLightbox}>
            {/* Content area — absorbs touches so they don't reach backdrop */}
            <SafeAreaView
              style={styles.lbSafe}
              edges={['top', 'bottom']}
              onStartShouldSetResponder={() => false}
            >
              <View
                style={styles.lbContent}
                onStartShouldSetResponder={() => true}
              >
                {/* Close button — rendered outside content block so it always sits on top */}
              </View>
            </SafeAreaView>

            {/* X button — sibling of SafeAreaView so no nesting conflict */}
            <TouchableOpacity
              onPress={closeLightbox}
              style={styles.lbClose}
              activeOpacity={0.7}
              hitSlop={20}
            >
              <Feather name="x" size={26} color="#fff" />
            </TouchableOpacity>

            {/* Centred image + caption — sits over backdrop but doesn't block X */}
            <View style={styles.lbCenter} pointerEvents="none">
              <Image
                source={thumbSource}
                style={styles.lbImage}
                resizeMode="contain"
              />
              <View style={styles.lbCaptionWrap}>
                <Text style={styles.lbCaption} numberOfLines={3}>
                  {exercise.name}
                </Text>
              </View>
            </View>
          </Pressable>
        </Modal>
      )}

      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.card,
            borderColor: open ? 'rgba(26,26,26,0.3)' : colors.border,
            opacity: done ? 0.5 : 1,
          },
        ]}
      >
        <Pressable onPress={toggle} style={styles.header}>
          <TouchableOpacity
            onPress={handleCheck}
            hitSlop={8}
            style={[
              styles.checkbox,
              {
                borderColor: done ? colors.primary : 'rgba(0,0,0,0.2)',
                backgroundColor: done ? colors.primary : 'transparent',
              },
            ]}
          >
            {done && <Feather name="check" size={11} color="#fff" />}
          </TouchableOpacity>

          {thumbSource && (
            <TouchableOpacity onPress={openLightbox} activeOpacity={0.75} style={styles.thumbWrap}>
              <Image source={thumbSource} style={styles.thumb} resizeMode="cover" />
              <View style={styles.thumbHint}>
                <Feather name="maximize-2" size={10} color="#fff" />
              </View>
            </TouchableOpacity>
          )}

          <View style={styles.body}>
            <Text style={[styles.name, { color: colors.foreground }]} numberOfLines={2}>
              {exercise.name}
            </Text>
            <Text style={[styles.purpose, { color: colors.mutedForeground }]} numberOfLines={1}>
              {exercise.purpose}
            </Text>
          </View>

          <View style={styles.right}>
            {showReps && reps != null && (
              <View style={[styles.repPill, { backgroundColor: levelBg }]}>
                <Text style={[styles.repText, { color: levelText }]}>{reps} reps</Text>
              </View>
            )}
            <Animated.View style={{ transform: [{ rotate }] }}>
              <Feather name="chevron-right" size={18} color={colors.mutedForeground} />
            </Animated.View>
          </View>
        </Pressable>

        {open && (
          <View style={[styles.detail, { borderTopColor: colors.border }]}>
            <Text style={[styles.instruction, { color: '#555' }]}>
              {exercise.instruction}
              {showReps && reps != null && (
                <Text style={{ color: colors.foreground, fontWeight: '500' as const }}>
                  {' '}Target: {reps} reps.
                </Text>
              )}
            </Text>
            {exercise.timer != null && <Timer seconds={exercise.timer} gong={!!exercise.gong} />}
            <View style={styles.tags}>
              {exercise.tags.map((t) => (
                <View key={t} style={[styles.tag, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
                  <Text style={[styles.tagText, { color: colors.mutedForeground }]}>{t}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    gap: 10,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  thumbWrap: {
    width: 48,
    height: 48,
    borderRadius: 6,
    overflow: 'hidden',
    backgroundColor: '#f0f0ec',
    flexShrink: 0,
  },
  thumb: {
    width: '100%',
    height: '100%',
  },
  thumbHint: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderRadius: 3,
    padding: 2,
  },
  body: { flex: 1, minWidth: 0 },
  name: { fontSize: 13, fontWeight: '500', lineHeight: 18 },
  purpose: { fontSize: 11, marginTop: 2, lineHeight: 15 },
  right: { flexDirection: 'column', alignItems: 'flex-end', gap: 5, flexShrink: 0 },
  repPill: {
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  repText: { fontSize: 10, fontWeight: '600' },
  detail: {
    borderTopWidth: 1,
    marginHorizontal: 14,
    paddingVertical: 12,
  },
  instruction: { fontSize: 13, lineHeight: 22 },
  timerWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 10,
    padding: 12,
    marginTop: 10,
    marginBottom: 4,
    borderWidth: 1,
  },
  timerDisplay: { fontSize: 26, fontWeight: '500', letterSpacing: 2 },
  timerBtns: { flexDirection: 'row', gap: 6 },
  timerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: '#fff',
  },
  timerBtnText: { fontSize: 12, fontWeight: '500' },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 10 },
  tag: {
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  tagText: { fontSize: 10 },

  // Lightbox
  lbOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.92)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lbSafe: {
    ...StyleSheet.absoluteFillObject,
  },
  lbContent: {
    ...StyleSheet.absoluteFillObject,
  },
  // X button — absolutely positioned over everything, always on top
  lbClose: {
    position: 'absolute',
    top: 52,
    right: 16,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  // Image + caption centred in overlay, pointerEvents none so X receives touches
  lbCenter: {
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  lbImage: {
    width: WIN.width - 24,
    height: WIN.height * 0.72,
  },
  lbCaptionWrap: {
    marginTop: 18,
    paddingHorizontal: 16,
    maxWidth: WIN.width - 40,
  },
  lbCaption: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    lineHeight: 24,
  },
});
