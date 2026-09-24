window.TASKS = [
  {
    id: 1,
    difficulty: 1,
    title: { ru: "Привет, Python!", en: "Hello, Python!" },
    desc: {
      ru: "Напиши код, который выводит строку ровно в таком виде:\n\n  Привет, Python!\n\n(с большой буквы, без пробелов по краям).",
      en: "Write code that prints exactly this line:\n\n  Привет, Python!\n\n(capital letters, no extra spaces)."
    },
    starter: `# Напиши print() со строкой "Привет, Python!"
`,
    expected: `Привет, Python!`
  },
  {
    id: 2,
    difficulty: 1,
    title: { ru: "Арифметика", en: "Arithmetic" },
    desc: {
      ru: "Выведи результат выражения:\n\n  (5 + 3) * 2 ** 2 - 8 // 3\n\nСосчитай сам на бумажке, потом проверь себя кодом.",
      en: "Print the result of the expression:\n\n  (5 + 3) * 2 ** 2 - 8 // 3\n\nWork it out on paper first, then verify it with code."
    },
    starter: `print((5 + 3) * 2 ** 2 - 8 // 3)
`,
    expected: `30`
  },
  {
    id: 3,
    difficulty: 1,
    title: { ru: "Чётное или нечётное", en: "Even or odd" },
    desc: {
      ru: "Допиши функцию is_even(n), чтобы она возвращала True для чётного n и False для нечётного.\n\nПодсказка: используй остаток от деления n % 2.",
      en: "Finish the function is_even(n) so it returns True for even n and False for odd n.\n\nHint: use the modulo n % 2."
    },
    starter: `def is_even(n):
    # верни True, если n чётное
    return False  # замени

print(is_even(4))
print(is_even(7))
`,
    expected: `True
False`
  },
  {
    id: 4,
    difficulty: 1,
    title: { ru: "FizzBuzz", en: "FizzBuzz" },
    desc: {
      ru: "Классика собеседований. Для каждого числа от 1 до 15:\n- если кратно 3 → выведи Fizz\n- если кратно 5 → выведи Buzz\n- если кратно 15 → выведи FizzBuzz\n- иначе → само число",
      en: "The interview classic. For each number from 1 to 15:\n- divisible by 3 → print Fizz\n- divisible by 5 → print Buzz\n- divisible by 15 → print FizzBuzz\n- otherwise → print the number"
    },
    starter: `for i in range(1, 16):
    # выведи Fizz / Buzz / FizzBuzz / число
    print(i)
`,
    expected: `1
2
Fizz
4
Buzz
Fizz
7
8
Fizz
Buzz
11
Fizz
13
14
FizzBuzz`
  },
  {
    id: 5,
    difficulty: 1,
    title: { ru: "Длина строки", en: "String length" },
    desc: {
      ru: "Допиши count_letters(s), чтобы она возвращала количество символов в строке, НЕ считая пробелов.\n\nНапример: count_letters(\"hello world\") → 10",
      en: "Finish count_letters(s) so it returns the number of characters in the string, NOT counting spaces.\n\nExample: count_letters(\"hello world\") → 10"
    },
    starter: `def count_letters(s):
    # верни длину строки без пробелов
    return 0  # замени

print(count_letters("hello world"))
print(count_letters("Python is fun"))
`,
    expected: `10
11`
  },
  {
    id: 6,
    difficulty: 2,
    title: { ru: "Сумма списка", en: "List sum" },
    desc: {
      ru: "Допиши list_sum(nums), которая возвращает сумму чисел списка. НЕ используй встроенную sum() — напиши цикл самостоятельно.",
      en: "Finish list_sum(nums) which returns the sum of the numbers in the list. Do NOT use the built-in sum() — write a loop yourself."
    },
    starter: `def list_sum(nums):
    total = 0
    # просуммируй числа в цикле
    return total

print(list_sum([1, 2, 3, 4, 5]))
print(list_sum([10, -10, 0]))
`,
    expected: `15
0`
  },
  {
    id: 7,
    difficulty: 2,
    title: { ru: "Максимум", en: "The maximum" },
    desc: {
      ru: "Допиши find_max(nums), которая возвращает максимальное число в списке. НЕ используй max() — пройдись циклом и запомни большее.",
      en: "Finish find_max(nums) which returns the maximum number in the list. Do NOT use max() — iterate and remember the biggest one."
    },
    starter: `def find_max(nums):
    largest = nums[0]
    # обнови largest, если найдёшь число больше
    return largest

print(find_max([3, 7, 2, 9, 5]))
print(find_max([-4, -1, -10]))
`,
    expected: `9
-1`
  },
  {
    id: 8,
    difficulty: 2,
    title: { ru: "Подсчёт гласных", en: "Counting vowels" },
    desc: {
      ru: "Допиши count_vowels(s), которая считает гласные буквы в строке. Считай и русские, и латинские:\n\nгласные: a e i o u а е и о у ы э я ю",
      en: "Finish count_vowels(s) which counts vowel letters in the string. Count both Russian and Latin ones:\n\nvowels: a e i o u а е и о у ы э я ю"
    },
    starter: `VOWELS = "aeiouаеиоуыэяю"

def count_vowels(s):
    count = 0
    # посчитай гласные буквы в s
    return count

print(count_vowels("hello"))
print(count_vowels("привет мир"))
`,
    expected: `2
3`
  },
  {
    id: 9,
    difficulty: 2,
    title: { ru: "Палиндром", en: "Palindrome" },
    desc: {
      ru: "Палиндром — слово или фраза, которая читается одинаково слева направо и справа налево: radar, шалаш.\n\nДопиши is_palindrome(s): True, если строка — палиндром.",
      en: "A palindrome reads the same forwards and backwards: radar, racecar.\n\nFinish is_palindrome(s): True if the string is a palindrome."
    },
    starter: `def is_palindrome(s):
    # сравни s и перевёрнутую s
    return False  # замени

print(is_palindrome("radar"))
print(is_palindrome("python"))
print(is_palindrome("шалаш"))
`,
    expected: `True
False
True`
  },
  {
    id: 10,
    difficulty: 2,
    title: { ru: "Факториал", en: "Factorial" },
    desc: {
      ru: "Факториал числа n (n!) — произведение всех чисел от 1 до n: 5! = 1·2·3·4·5 = 120. При этом 0! = 1.\n\nДопиши factorial(n), чтобы она возвращала n!",
      en: "The factorial of n (n!) is the product of all numbers from 1 to n: 5! = 1·2·3·4·5 = 120. And 0! = 1.\n\nFinish factorial(n) so it returns n!"
    },
    starter: `def factorial(n):
    result = 1
    # перемножь числа от 1 до n в цикле
    return result

print(factorial(5))
print(factorial(0))
`,
    expected: `120
1`
  },
  {
    id: 11,
    difficulty: 2,
    title: { ru: "Числа Фибоначчи", en: "Fibonacci numbers" },
    desc: {
      ru: "Каждое следующее число Фибоначчи — сумма двух предыдущих: 0, 1, 1, 2, 3, 5, 8, …\n\nДопиши цикл, чтобы программа вывела первые 10 чисел (как в примере ниже).",
      en: "Each Fibonacci number is the sum of the previous two: 0, 1, 1, 2, 3, 5, 8, …\n\nFinish the loop so the program prints the first 10 numbers (all on one line)."
    },
    starter: `a, b = 0, 1
for _ in range(10):
    print(a, end=" ")
    # вычисли следующую пару: a, b = ...
`,
    expected: `0 1 1 2 3 5 8 13 21 34`
  },
  {
    id: 12,
    difficulty: 2,
    title: { ru: "Слова наоборот", en: "Reversed words" },
    desc: {
      ru: "Допиши reverse_words(s), которая возвращает строку со словами в обратном порядке.\n\n\"кот и собака\" → \"собака и кот\"",
      en: "Finish reverse_words(s) which returns the string with the words in reverse order.\n\n\"one two three\" → \"three two one\""
    },
    starter: `def reverse_words(s):
    # разбей на слова, разверни и склей обратно
    return ""  # замени

print(reverse_words("кот и собака"))
print(reverse_words("один два три"))
`,
    expected: `собака и кот
три два один`
  },
  {
    id: 13,
    difficulty: 2,
    title: { ru: "Среднее арифметическое", en: "Average" },
    desc: {
      ru: "Допиши average(nums), которая возвращает среднее арифметическое чисел списка.\n\nПодсказка: сумма / количество. Не забудь про float-деление!",
      en: "Finish average(nums) which returns the arithmetic mean of the numbers in the list.\n\nHint: sum / count. Use float division!"
    },
    starter: `def average(nums):
    # сумма / количество элементов
    return 0  # замени

print(average([2, 4, 6]))
print(average([10, 20]))
`,
    expected: `4.0
15.0`
  },
  {
    id: 14,
    difficulty: 3,
    title: { ru: "Частотность символов", en: "Character frequency" },
    desc: {
      ru: "Допиши char_counts(s), которая возвращает словарь: символ → сколько раз он встречается в строке.\n\nИспользуй цикл по символам строки и словарь-счётчик.",
      en: "Finish char_counts(s) which returns a dictionary: character → how many times it occurs in the string.\n\nUse a loop over the characters and a dict counter."
    },
    starter: `def char_counts(s):
    counts = {}
    # посчитай каждый символ
    return counts

print(char_counts("banana"))
print(char_counts("хай"))
`,
    expected: `{'b': 1, 'a': 3, 'n': 2}
{'х': 1, 'а': 1, 'й': 1}`
  },
  {
    id: 15,
    difficulty: 3,
    title: { ru: "Простые числа", en: "Prime numbers" },
    desc: {
      ru: "Натуральное число — простое, если оно > 1 и делится только на 1 и на себя.\n\nВыведи все простые числа от 2 до 30 включительно, через пробел (в одну строку).",
      en: "A natural number is prime if it is > 1 and divisible only by 1 and itself.\n\nPrint all primes from 2 to 30 inclusive, separated by spaces (one line)."
    },
    starter: `for n in range(2, 31):
    # проверь, делится ли n на что-то кроме 1 и n
    is_prime = True
    # ...
    if is_prime:
        print(n, end=" ")
`,
    expected: `2 3 5 7 11 13 17 19 23 29`
  }
];