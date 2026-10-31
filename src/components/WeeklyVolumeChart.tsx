import { useColorScheme } from 'nativewind';
import { useMemo } from 'react';
import { Dimensions, Text, View } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';

const CHART_WIDTH = Dimensions.get('window').width - 64;

interface Props {
  weeklyVolume: Array<{ weekStart: string; volume: number }>;
}

export function WeeklyVolumeChart({ weeklyVolume }: Props) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const colors = {
    cardBg: isDark ? '#1F2937' : '#FFFFFF',
    title: isDark ? '#F9FAFB' : '#111827',
    subtitle: isDark ? '#9CA3AF' : '#6B7280',
    axisText: isDark ? '#9CA3AF' : '#9CA3AF',
    rule: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
    barActive: '#2563EB',
    barEmpty: isDark ? '#374151' : '#E5E7EB',
  };

  const data = useMemo(() => {
    return weeklyVolume.map((w) => {
      const date = new Date(w.weekStart);
      const label = `${date.getDate()}/${date.getMonth() + 1}`;
      return {
        value: w.volume,
        label,
        frontColor: w.volume > 0 ? colors.barActive : colors.barEmpty,
      };
    });
  }, [weeklyVolume, colors.barActive, colors.barEmpty]);

  const totalVolume = weeklyVolume.reduce((sum, w) => sum + w.volume, 0);

  return (
    <View
      className='mb-4 rounded-2xl p-4'
      style={{ backgroundColor: colors.cardBg }}
    >
      <Text
        className='mb-1 text-base font-bold'
        style={{ color: colors.title }}
      >
        Volumen semanal
      </Text>
      <Text
        className='mb-4 text-xs'
        style={{ color: colors.subtitle }}
      >
        {totalVolume.toLocaleString()} kg acumulados en {weeklyVolume.length}{' '}
        semanas
      </Text>

      <BarChart
        data={data}
        width={CHART_WIDTH}
        height={180}
        barWidth={26}
        barBorderRadius={6}
        spacing={18}
        noOfSections={3}
        yAxisThickness={0}
        xAxisThickness={0}
        yAxisTextStyle={{ color: colors.axisText, fontSize: 11 }}
        xAxisLabelTextStyle={{ color: colors.axisText, fontSize: 10 }}
        rulesColor={colors.rule}
        isAnimated
        animationDuration={500}
        backgroundColor='transparent'
      />
    </View>
  );
}
