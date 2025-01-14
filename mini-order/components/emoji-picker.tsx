import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const foodEmojis = [
  "🍔", "🍕", "🌭", "🍟", "🌮", "🌯", "🥙", "🥪",
  "🍗", "🍖", "🍤", "🍣", "🍱", "🍛", "🍜", "🍝",
  "🍳", "🥘", "🍲", "🥗", "🥣", "🥫", "🍥", "🍡",
  "🥟", "🥠", "🥡", "🦪", "🍦", "🍧", "🍨", "🍩",
  "🍪", "🎂", "🍰", "🧁", "🥧", "🍫", "🍬", "🍭",
  "🍮", "🍯", "🍼", "🥛", "☕", "🍵", "🍶", "🍾",
  "🍷", "🍸", "🍹", "🍺", "🍻", "🥂", "🥃", "🧃",
  "🧉", "🧊", "🥤", "🧋", "🍎", "🍐", "🍊", "🍋",
  "🍌", "🍉", "🍇", "🍓", "🍈", "🍒", "🍑", "🥭",
  "🍍", "🥥", "🥝", "🍅", "🍆", "🥑", "🥦", "🥬",
  "🥒", "🌶", "🌽", "🥕", "🧄", "🧅", "🥔", "🍠",
  "🥐", "🥯", "🍞", "🥖", "🥨", "🧀", "🥚", "🧈",
  "🥞", "🧇", "🥓", "🧆"
]

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void
  selectedEmoji: string
}

export function EmojiPicker({ onEmojiSelect, selectedEmoji }: EmojiPickerProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-16 h-16 text-4xl">
          {selectedEmoji}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-2">
        <div className="grid grid-cols-8 gap-2">
          {foodEmojis.map((emoji) => (
            <Button
              key={emoji}
              variant="ghost"
              className="w-8 h-8 p-0"
              onClick={() => {
                onEmojiSelect(emoji)
                setIsOpen(false)
              }}
            >
              {emoji}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}

