import { clsx } from 'clsx'
import { useEffect } from '@lynx-js/react';
import './FilterTags.scss';

export interface FilterLabelItem {
  label: string;
  value: string;
}

interface FilterTagsProps {
  labels: FilterLabelItem[];
  selectedLabels: string[];
  onChange: (selectedValues: string[]) => void;
  loading?: boolean;
  nodata?: boolean;
  className?: string;
  style?: Record<string, string | number>;
}

export function FilterTags({
  labels,
  selectedLabels,
  onChange,
  loading,
  nodata,
  className,
  style,
}: FilterTagsProps) {
  useEffect(() => {
    console.log('FilterTags', labels, selectedLabels);
  }, [labels, selectedLabels]);

  if (loading || nodata || !labels.length) {
    return null;
  }

  const toggleLabel = (value: string) => {
    const set = new Set(selectedLabels);
    if (set.has(value)) {
      set.delete(value);
    } else {
      set.add(value);
    }
    onChange(Array.from(set));
  };

  return (
    <view className={clsx('filter-tags', className)} style={style}>
      <scroll-view
        className="filter-tags__scroll"
        scroll-orientation="horizontal"
        show-scroll-bar={false}
      >
        {labels.map((item) => (
          <view
            key={`${item.label + item.value}`}
            className={clsx(
              'filter-tags__item',
              selectedLabels.includes(item.value) &&
                'filter-tags__item--active',
            )}
            bindtap={() => toggleLabel(item.value)}
          >
            <text className="filter-tags__text">{item.label}</text>
          </view>
        ))}
      </scroll-view>
    </view>
  );
}
