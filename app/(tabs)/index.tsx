import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useCallback, useState } from 'react';
import {
  Alert,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ExerciseCard from '@/components/ExerciseCard';
import { useSession } from '@/context/SessionContext';
import { LEVELS, PHASES, type Level } from '@/data/exercises';
import { useColors } from '@/hooks/useColors';

type Tab = 'session' | 'history' | 'about';

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<Tab>('session');

  const {
    level,
    setLevel,
    currentPhase,
    setCurrentPhase,
    completedExercises,
    toggleExercise,
    finishSession,
    history,
    deleteSession,
  } = useSession();

  const lc = LEVELS[level];
  const phase = PHASES[currentPhase];
  const doneCount = completedExercises[phase.id]?.size ?? 0;
  const total = phase.exercises.length;
  const pct = total > 0 ? doneCount / total : 0;

  const handleFinish = useCallback(() => {
    Alert.alert(
      'Complete Session',
      'Log this session to your history?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Session',
          onPress: () => {
            finishSession();
            setActiveTab('history');
            if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          },
        },
      ]
    );
  }, [finishSession]);

  const handleTabSwitch = useCallback((t: Tab) => {
    setActiveTab(t);
    if (Platform.OS !== 'web') Haptics.selectionAsync();
  }, []);

  const handleLevelSet = useCallback((l: Level) => {
    setLevel(l);
    if (Platform.OS !== 'web') Haptics.selectionAsync();
  }, [setLevel]);

  const topPad = Platform.OS === 'web' ? Math.max(insets.top, 67) : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : 0;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          { paddingTop: topPad + 12, paddingBottom: bottomPad + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Brand Header */}
        <View style={[styles.brandCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Image
            source={require('@/assets/images/logo.jpg')}
            style={styles.logoImg}
            resizeMode="contain"
          />
          <View style={styles.brandText}>
            <Text style={[styles.brandName, { color: colors.foreground }]}>PranaSync Balance</Text>
            <View style={styles.brandDivider} />
            <Text style={[styles.brandTag, { color: colors.mutedForeground }]}>
              Ancient breathwork & energy practice{'\n'}fused with modern core training
            </Text>
            <Text style={[styles.brandBy, { color: '#aaa' }]}>BY LISA PROSSER · MASTER TEACHER</Text>
          </View>
        </View>

        {/* Pillars */}
        {(() => {
          const activePillar = currentPhase === 0 ? 0 : currentPhase <= 4 ? 1 : 2;
          return (
            <View style={styles.pillars}>
              {[
                { label: 'Breath & Energy', sub: 'Prana activation' },
                { label: 'Core & Strength', sub: 'Unshakeable stability' },
                { label: 'Balance & Mind', sub: 'Alignment & calm' },
              ].map((p, i) => {
                const isActive = i === activePillar;
                return (
                  <View
                    key={p.label}
                    style={[
                      styles.pillar,
                      {
                        backgroundColor: isActive ? '#E6F1FB' : colors.card,
                        borderColor: isActive ? '#185FA5' : colors.border,
                      },
                    ]}
                  >
                    <Text style={[styles.pillarLabel, { color: isActive ? '#0C447C' : colors.foreground }]}>{p.label}</Text>
                    <Text style={[styles.pillarSub, { color: isActive ? '#185FA5' : colors.mutedForeground }]}>{p.sub}</Text>
                  </View>
                );
              })}
            </View>
          );
        })()}

        {/* Level Selector */}
        <View style={styles.levels}>
          {(['beginner', 'advanced', 'pro'] as Level[]).map((l) => {
            const active = level === l;
            const lev = LEVELS[l];
            const bg = active
              ? l === 'beginner' ? colors.beginnerBg : l === 'advanced' ? colors.advancedBg : colors.proBg
              : colors.card;
            const borderC = active
              ? l === 'beginner' ? colors.beginner : l === 'advanced' ? colors.advanced : colors.pro
              : colors.border;
            const textC = active
              ? l === 'beginner' ? colors.beginnerText : l === 'advanced' ? colors.advancedText : colors.proText
              : colors.mutedForeground;
            return (
              <TouchableOpacity
                key={l}
                onPress={() => handleLevelSet(l)}
                style={[styles.levelBtn, { backgroundColor: bg, borderColor: borderC }]}
              >
                <Text style={[styles.levelLabel, { color: textC }]}>{lev.label}</Text>
                <Text style={[styles.levelSub, { color: textC, opacity: 0.7 }]}>{lev.reps} reps</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Progress bar */}
        <View style={[styles.barTrack, { backgroundColor: 'rgba(0,0,0,0.08)' }]}>
          <View
            style={[
              styles.barFill,
              {
                width: lc.barWidth as `${number}%`,
                backgroundColor: lc.color,
              },
            ]}
          />
        </View>

        {/* Tab bar */}
        <View style={[styles.tabBar, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
          {(['session', 'history', 'about'] as Tab[]).map((t) => (
            <Pressable
              key={t}
              onPress={() => handleTabSwitch(t)}
              style={[
                styles.tabBtn,
                { borderBottomColor: activeTab === t ? colors.foreground : 'transparent' },
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: activeTab === t ? colors.foreground : colors.mutedForeground },
                ]}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Session Tab */}
        {activeTab === 'session' && (
          <View>
            {/* Phase Nav */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.phaseNav}>
              {PHASES.map((p, i) => (
                <TouchableOpacity
                  key={p.id}
                  onPress={() => {
                    setCurrentPhase(i);
                    if (Platform.OS !== 'web') Haptics.selectionAsync();
                  }}
                  style={[
                    styles.phasePill,
                    {
                      backgroundColor: i === currentPhase ? colors.foreground : colors.card,
                      borderColor: i === currentPhase ? colors.foreground : colors.border,
                    },
                  ]}
                >
                  <Text style={[styles.phasePillText, { color: i === currentPhase ? '#fff' : colors.mutedForeground }]}>
                    {p.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Phase Header */}
            {phase.side && (
              <View style={[
                styles.sideBanner,
                phase.side === 'right'
                  ? { backgroundColor: '#EEF0FF', borderColor: '#8899DD' }
                  : { backgroundColor: '#FFF0EE', borderColor: '#DD8877' },
              ]}>
                <Feather
                  name={phase.side === 'right' ? 'arrow-right' : 'arrow-left'}
                  size={14}
                  color={phase.side === 'right' ? '#223' : '#322'}
                />
                <Text style={[styles.sideBannerText, { color: phase.side === 'right' ? '#223' : '#322' }]}>
                  {phase.side === 'right' ? 'Right side' : 'Left side'}
                </Text>
              </View>
            )}
            <Text style={[styles.phaseTitle, { color: colors.foreground }]}>{phase.title}</Text>

            {/* Progress */}
            <View style={styles.progRow}>
              <Text style={[styles.progText, { color: colors.mutedForeground }]}>{doneCount} / {total} exercises</Text>
              <Text style={[styles.progText, { color: colors.mutedForeground }]}>{Math.round(pct * 100)}%</Text>
            </View>
            <View style={[styles.progBg, { backgroundColor: 'rgba(0,0,0,0.08)' }]}>
              <View style={[styles.progFill, { width: `${pct * 100}%` as `${number}%`, backgroundColor: colors.foreground }]} />
            </View>

            {/* Exercises */}
            {phase.exercises.map((ex, idx) => (
              <ExerciseCard
                key={ex.name}
                exercise={ex}
                index={idx}
                phaseId={phase.id}
                done={completedExercises[phase.id]?.has(idx) ?? false}
                reps={lc.reps}
                levelColor={lc.color}
                levelBg={
                  level === 'beginner' ? colors.beginnerBg
                  : level === 'advanced' ? colors.advancedBg
                  : colors.proBg
                }
                levelText={
                  level === 'beginner' ? colors.beginnerText
                  : level === 'advanced' ? colors.advancedText
                  : colors.proText
                }
                showReps={phase.hasReps}
                onToggleDone={() => toggleExercise(phase.id, idx)}
              />
            ))}

            {/* Nav buttons */}
            <View style={[styles.navRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <TouchableOpacity
                onPress={() => setCurrentPhase(Math.max(0, currentPhase - 1))}
                disabled={currentPhase === 0}
                style={[styles.navBtn, { borderColor: colors.border, opacity: currentPhase === 0 ? 0.3 : 1 }]}
              >
                <Text style={[styles.navBtnText, { color: colors.foreground }]}>← Prev</Text>
              </TouchableOpacity>
              <Text style={[styles.navCtr, { color: colors.mutedForeground }]}>{currentPhase + 1} / {PHASES.length}</Text>
              <TouchableOpacity
                onPress={() => setCurrentPhase(Math.min(PHASES.length - 1, currentPhase + 1))}
                disabled={currentPhase === PHASES.length - 1}
                style={[styles.navBtn, { borderColor: colors.border, opacity: currentPhase === PHASES.length - 1 ? 0.3 : 1 }]}
              >
                <Text style={[styles.navBtnText, { color: colors.foreground }]}>Next →</Text>
              </TouchableOpacity>
            </View>

            {/* Complete button */}
            <TouchableOpacity onPress={handleFinish} style={[styles.finishBtn, { backgroundColor: colors.primary }]}>
              <Text style={[styles.finishText, { color: colors.primaryForeground }]}>Complete & Log Session</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <View>
            {/* Stats grid */}
            <View style={styles.statsGrid}>
              {[
                { n: String(history.length), l: 'Sessions' },
                { n: String(history.reduce((a, s) => a + s.totalDone, 0)), l: 'Exercises' },
                { n: String(history.filter((s) => s.completedPhases === PHASES.length).length), l: 'Full sessions' },
                {
                  n: history.length > 0
                    ? LEVELS[
                        ((['beginner', 'advanced', 'pro'] as Level[]).sort(
                          (a, b) =>
                            history.filter((s) => s.level === b).length -
                            history.filter((s) => s.level === a).length
                        )[0]) as Level
                      ].label
                    : '—',
                  l: 'Top level',
                },
              ].map((s) => (
                <View key={s.l} style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <Text style={[styles.statNum, { color: colors.foreground }]}>{s.n}</Text>
                  <Text style={[styles.statLabel, { color: colors.foreground }]}>{s.l}</Text>
                </View>
              ))}
            </View>

            {history.length === 0 ? (
              <View style={[styles.emptyCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Feather name="activity" size={32} color={colors.mutedForeground} />
                <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
                  No sessions logged yet.{'\n'}Complete your first session to start tracking.
                </Text>
              </View>
            ) : (
              history.map((s) => {
                const rc =
                  s.level === 'beginner'
                    ? { bg: colors.beginnerBg, text: colors.beginnerText }
                    : s.level === 'advanced'
                    ? { bg: colors.advancedBg, text: colors.advancedText }
                    : { bg: colors.proBg, text: colors.proText };
                return (
                  <View key={s.id} style={[styles.histCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <View style={styles.histTop}>
                      <View>
                        <Text style={[styles.histDate, { color: colors.foreground }]}>{s.date}</Text>
                        <Text style={[styles.histTime, { color: colors.foreground }]}>{s.time}</Text>
                      </View>
                      <View style={styles.histRight}>
                        <View style={[styles.repPillSm, { backgroundColor: rc.bg }]}>
                          <Text style={[styles.repPillSmText, { color: rc.text }]}>
                            {LEVELS[s.level].label} · {s.reps}x
                          </Text>
                        </View>
                        <TouchableOpacity
                          onPress={() => {
                            deleteSession(s.id);
                            if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                          }}
                        >
                          <Feather name="x" size={16} color={colors.mutedForeground} />
                        </TouchableOpacity>
                      </View>
                    </View>
                    <View style={styles.histStats}>
                      <Text style={[styles.histStat, { color: colors.foreground }]}>
                        <Text style={{ fontWeight: '700' }}>{s.totalDone}</Text>
                        {' '}/ {s.totalExercises} exercises
                      </Text>
                      <Text style={[styles.histStat, { color: colors.foreground }]}>
                        <Text style={{ fontWeight: '700' }}>{s.completedPhases}</Text>
                        {' '}/ {PHASES.length} steps
                      </Text>
                    </View>
                    <View style={styles.histDots}>
                      {s.phases.map((p) => (
                        <View
                          key={p.id}
                          style={[
                            styles.dot,
                            {
                              backgroundColor: p.done === p.total ? colors.beginnerBg : colors.secondary,
                              borderColor: p.done === p.total ? colors.beginner : colors.border,
                            },
                          ]}
                        >
                          <Text style={[styles.dotText, { color: p.done === p.total ? colors.beginnerText : colors.foreground }]}>
                            {p.label} {p.done}/{p.total}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                );
              })
            )}
          </View>
        )}

        {/* About Tab */}
        {activeTab === 'about' && (
          <View style={[styles.aboutCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.aboutHead, { color: colors.foreground }]}>What is PranaSync Balance?</Text>
            <Text style={[styles.aboutBody, { color: '#555' }]}>
              PranaSync Balance is a holistic exercise plan integrating breathwork, kriyas, core
              strengthening, side body work, stretches, and concluding breathwork to harmonize
              body, mind, and energy.
            </Text>
            <Text style={[styles.aboutBody, { color: '#555' }]}>
              Follow the steps in sequence for a balanced session. Perform each exercise mindfully,
              focusing on your breath. Consult a professional if you have any health concerns.
            </Text>

            {[
              { label: 'What You Need', text: 'Yoga mat or blanket · Loose comfortable clothing · Water bottle' },
              { label: 'Health requirements', text: 'You must be able to sit on the floor and lie comfortably on your back.' },
            ].map((s) => (
              <View key={s.label} style={[styles.aboutSection, { borderTopColor: colors.border }]}>
                <Text style={[styles.aboutLabel, { color: colors.mutedForeground }]}>{s.label.toUpperCase()}</Text>
                <Text style={[styles.aboutText, { color: '#555' }]}>{s.text}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 16 },

  brandCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  logoImg: {
    width: 76,
    height: 76,
    flexShrink: 0,
    borderRadius: 8,
  },
  brandText: { flex: 1 },
  brandName: { fontSize: 17, fontWeight: '600', letterSpacing: 0.3 },
  brandDivider: { width: 28, height: 1, backgroundColor: 'rgba(0,0,0,0.12)', marginVertical: 5 },
  brandTag: { fontSize: 11, lineHeight: 17, fontStyle: 'italic' },
  brandBy: { fontSize: 9, letterSpacing: 2, marginTop: 4 },

  pillars: { flexDirection: 'row', gap: 6, marginBottom: 10 },
  pillar: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    padding: 8,
    alignItems: 'center',
  },
  pillarLabel: { fontSize: 11, fontWeight: '500', textAlign: 'center', lineHeight: 15 },
  pillarSub: { fontSize: 10, marginTop: 2, textAlign: 'center' },

  levels: { flexDirection: 'row', gap: 6, marginBottom: 6 },
  levelBtn: {
    flex: 1,
    borderRadius: 8,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 4,
    alignItems: 'center',
  },
  levelLabel: { fontSize: 12, fontWeight: '500' },
  levelSub: { fontSize: 10, marginTop: 1 },

  barTrack: { height: 3, borderRadius: 2, marginBottom: 12, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 2 },

  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 12,
  },
  tabBtn: { flex: 1, paddingVertical: 11, alignItems: 'center', borderBottomWidth: 2 },
  tabText: { fontSize: 13, fontWeight: '500' },

  phaseNav: { marginBottom: 10 },
  phasePill: {
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginRight: 5,
  },
  phasePillText: { fontSize: 12, fontWeight: '500' },

  sideBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 10,
  },
  sideBannerText: { fontSize: 12, fontWeight: '500' },
  phaseTitle: { fontSize: 16, fontWeight: '600', marginBottom: 10 },

  progRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  progText: { fontSize: 11 },
  progBg: { height: 4, borderRadius: 3, marginBottom: 12, overflow: 'hidden' },
  progFill: { height: '100%', borderRadius: 3 },

  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 8,
    borderWidth: 1,
    padding: 10,
    marginTop: 12,
  },
  navBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
  },
  navBtnText: { fontSize: 12, fontWeight: '500' },
  navCtr: { fontSize: 11 },

  finishBtn: {
    marginTop: 12,
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: 'center',
  },
  finishText: { fontSize: 13, fontWeight: '600', letterSpacing: 0.5 },

  statsGrid: { flexDirection: 'row', gap: 6, marginBottom: 14 },
  statCard: {
    flex: 1,
    borderRadius: 8,
    borderWidth: 1,
    padding: 12,
    alignItems: 'center',
  },
  statNum: { fontSize: 22, fontWeight: '600' },
  statLabel: { fontSize: 12, fontWeight: '500', marginTop: 3, textAlign: 'center' },

  emptyCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 32,
    alignItems: 'center',
    gap: 12,
  },
  emptyText: { fontSize: 14, lineHeight: 24, textAlign: 'center' },

  histCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 8,
  },
  histTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  histDate: { fontSize: 16, fontWeight: '600' },
  histTime: { fontSize: 13, marginTop: 3 },
  histRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  repPillSm: { borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4 },
  repPillSmText: { fontSize: 12, fontWeight: '600' },
  histStats: { flexDirection: 'row', gap: 16, marginBottom: 10 },
  histStat: { fontSize: 14 },
  histDots: { flexDirection: 'row', flexWrap: 'wrap', gap: 5 },
  dot: { borderRadius: 8, borderWidth: 1, paddingHorizontal: 10, paddingVertical: 5 },
  dotText: { fontSize: 12 },

  aboutCard: { borderRadius: 12, borderWidth: 1, padding: 18 },
  aboutHead: { fontSize: 15, fontWeight: '600', marginBottom: 12 },
  aboutBody: { fontSize: 13, lineHeight: 22, marginBottom: 12 },
  aboutSection: { borderTopWidth: 1, paddingTop: 14, marginTop: 14 },
  aboutLabel: { fontSize: 10, letterSpacing: 2, marginBottom: 6, fontWeight: '500' },
  aboutText: { fontSize: 13, lineHeight: 22 },
});
