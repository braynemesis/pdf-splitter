import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface SizeSelectorProps {
  value: number;
  onChange: (value: number) => void;
}

export function SizeSelector({ value, onChange }: SizeSelectorProps) {
  return (
    <Select
      value={value.toString()}
      onValueChange={(val) => onChange(parseInt(val))}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Max file size" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="10">10 MB</SelectItem>
        <SelectItem value="20">20 MB</SelectItem>
        <SelectItem value="50">50 MB</SelectItem>
        <SelectItem value="100">100 MB</SelectItem>
      </SelectContent>
    </Select>
  );
}
