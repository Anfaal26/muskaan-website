export const PRESET_LABELS = [
  'Screen print',
  'Long Dress',
  'Azrakh Kaftan',
  'Azrakh 2 piece',
  '3 piece',
  'Delhi Collection',
  'Scarf (Hijab)',
  'Cotton Orna Set',
  'Cotton 2 piece',
];

const CUSTOM = '__custom__';

interface Props {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  id?: string;
}

export default function LabelSelect({ value, onChange, disabled, id = 'label' }: Props) {
  const isCustom = value !== '' && !PRESET_LABELS.includes(value);
  const selectValue = value === '' ? '' : isCustom ? CUSTOM : value;

  return (
    <div className="flex flex-col gap-2">
      <select
        id={id}
        value={selectValue}
        disabled={disabled}
        onChange={e => {
          const v = e.target.value;
          onChange(v === CUSTOM ? (isCustom ? value : '') : v);
        }}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-indigo-400 cursor-pointer disabled:bg-gray-50"
      >
        <option value="">No label</option>
        {PRESET_LABELS.map(l => (
          <option key={l} value={l}>{l}</option>
        ))}
        <option value={CUSTOM}>Custom label...</option>
      </select>
      {selectValue === CUSTOM && (
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          disabled={disabled}
          placeholder="Enter custom label"
          autoFocus
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-indigo-400 disabled:bg-gray-50"
        />
      )}
    </div>
  );
}
