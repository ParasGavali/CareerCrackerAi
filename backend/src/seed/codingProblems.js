// 20 Coding Problems for CareerCracker AI
// Categories: arrays, strings, dp, math, sorting, graphs, trees, greedy
// Target Companies: TCS, Infosys, Wipro, HCL, Cognizant, Capgemini, Accenture

const codingProblems = [
  {
    title: 'Two Sum',
    slug: 'two-sum',
    description: '<p>Given an array of integers <code>nums</code> and an integer <code>target</code>, return <em>indices of the two numbers such that they add up to <code>target</code></em>.</p><p>You may assume that each input would have <strong>exactly one solution</strong>, and you may not use the same element twice.</p><p>You can return the answer in any order, but for standard output, print the two indices separated by a space, sorted in ascending order (e.g., <code>0 1</code>).</p>',
    difficulty: 'easy',
    category: 'arrays',
    companyTags: ['TCS', 'Infosys', 'Accenture', 'Cognizant'],
    constraints: '2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9\n-10^9 <= target <= 10^9',
    inputFormat: 'First line contains the target.\nSecond line contains the size of the array, N.\nThird line contains N space-separated integers.',
    outputFormat: 'Print the two indices separated by a space (sorted in ascending order).',
    examples: [
      {
        input: '9\n4\n2 7 11 15',
        output: '0 1',
        explanation: 'Because nums[0] + nums[1] == 2 + 7 == 9, we return 0 1.'
      },
      {
        input: '6\n3\n3 2 4',
        output: '1 2',
        explanation: 'Because nums[1] + nums[2] == 2 + 4 == 6, we return 1 2.'
      }
    ],
    testCases: [
      { input: '9\n4\n2 7 11 15', expectedOutput: '0 1', isHidden: false },
      { input: '6\n3\n3 2 4', expectedOutput: '1 2', isHidden: false },
      { input: '6\n2\n3 3', expectedOutput: '0 1', isHidden: false },
      { input: '10\n5\n1 2 5 6 9', expectedOutput: '0 4', isHidden: true },
      { input: '8\n4\n4 2 1 4', expectedOutput: '0 3', isHidden: true }
    ],
    solutionTemplates: {
      javascript: `// Two Sum in JavaScript
// Read from stdin using readline()
const target = parseInt(readline().trim());
const n = parseInt(readline().trim());
const nums = readline().trim().split(' ').map(Number);

function solve(nums, target) {
    // Write your logic here
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const diff = target - nums[i];
        if (map.has(diff)) {
            return [map.get(diff), i];
        }
        map.set(nums[i], i);
    }
    return [];
}

const res = solve(nums, target);
console.log(res.join(' '));`,
      python: `# Two Sum in Python
import sys

def solve():
    lines = sys.stdin.read().splitlines()
    if not lines:
        return
    target = int(lines[0].strip())
    n = int(lines[1].strip())
    nums = list(map(int, lines[2].strip().split()))
    
    mapping = {}
    for i, num in enumerate(nums):
        diff = target - num
        if diff in mapping:
            print(f"{mapping[diff]} {i}")
            return
        mapping[num] = i

if __name__ == '__main__':
    solve()`,
      c: `#include <stdio.h>
#include <stdlib.h>

int main() {
    int target, n;
    if (scanf("%d", &target) == EOF) return 0;
    if (scanf("%d", &n) == EOF) return 0;
    
    int* nums = (int*)malloc(n * sizeof(int));
    for (int i = 0; i < n; i++) {
        if (scanf("%d", &nums[i]) == EOF) return 0;
    }
    
    // Write your code here
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            if (nums[i] + nums[j] == target) {
                printf("%d %d\\n", i, j);
                free(nums);
                return 0;
            }
        }
    }
    
    free(nums);
    return 0;
}`,
      cpp: `#include <iostream>
#include <vector>
#include <unordered_map>

using namespace std;

int main() {
    int target, n;
    if (!(cin >> target >> n)) return 0;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) {
        cin >> nums[i];
    }
    
    unordered_map<int, int> m;
    for (int i = 0; i < n; i++) {
        int diff = target - nums[i];
        if (m.find(diff) != m.end()) {
            cout << m[diff] << " " << i << endl;
            return 0;
        }
        m[nums[i]] = i;
    }
    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int target = sc.nextInt();
        int n = sc.nextInt();
        int[] nums = new int[n];
        for (int i = 0; i < n; i++) {
            nums[i] = sc.nextInt();
        }
        
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < n; i++) {
            int diff = target - nums[i];
            if (map.containsKey(diff)) {
                System.out.println(map.get(diff) + " " + i);
                return;
            }
            map.put(nums[i], i);
        }
    }
}`
    },
    hints: ['Try using a hash map to search for the complement in O(1) time.', 'For each number, target - num is the complement you need. Check if it exists in your map.'],
    acceptanceRate: 72.5
  },
  {
    title: 'Reverse a String',
    slug: 'reverse-a-string',
    description: '<p>Write a program that takes a string as input and outputs the string in reverse order.</p>',
    difficulty: 'easy',
    category: 'strings',
    companyTags: ['TCS', 'Wipro', 'HCL', 'Capgemini'],
    constraints: '1 <= string.length <= 10^5\nThe string contains printable ASCII characters.',
    inputFormat: 'A single line containing the input string.',
    outputFormat: 'Print the reversed string.',
    examples: [
      { input: 'hello', output: 'olleh', explanation: 'The reverse of "hello" is "olleh".' },
      { input: 'CareerCracker', output: 'rekcarCreeraC', explanation: 'The reverse of "CareerCracker" is "rekcarCreeraC".' }
    ],
    testCases: [
      { input: 'hello', expectedOutput: 'olleh', isHidden: false },
      { input: 'a', expectedOutput: 'a', isHidden: false },
      { input: 'ab', expectedOutput: 'ba', isHidden: false },
      { input: 'CareerCracker AI', expectedOutput: 'IA rekcarCreeraC', isHidden: true },
      { input: 'racecar', expectedOutput: 'racecar', isHidden: true }
    ],
    solutionTemplates: {
      javascript: `// Reverse a String in JavaScript
const str = readline().trim();

function solve(s) {
    return s.split('').reverse().join('');
}

console.log(solve(str));`,
      python: `# Reverse a String in Python
import sys

def solve():
    lines = sys.stdin.read().splitlines()
    if not lines:
        return
    s = lines[0]
    print(s[::-1])

if __name__ == '__main__':
    solve()`,
      c: `#include <stdio.h>
#include <string.h>

int main() {
    char str[1000];
    if (fgets(str, sizeof(str), stdin) == NULL) return 0;
    
    // Remove newline character
    int len = strlen(str);
    if (len > 0 && str[len-1] == '\\n') {
        str[len-1] = '\\0';
        len--;
    }
    
    for (int i = len - 1; i >= 0; i--) {
        putchar(str[i]);
    }
    printf("\\n");
    return 0;
}`,
      cpp: `#include <iostream>
#include <string>
#include <algorithm>

using namespace std;

int main() {
    string s;
    if (getline(cin, s)) {
        reverse(s.begin(), s.end());
        cout << s << endl;
    }
    return 0;
}`,
      java: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextLine()) {
            String s = sc.nextLine();
            StringBuilder sb = new StringBuilder(s);
            System.out.println(sb.reverse().toString());
        }
    }
}`
    },
    hints: ['You can iterate backwards from the end of the string to the beginning.', 'Many languages have built-in functions like reverse() or slice [::-1].'],
    acceptanceRate: 88.1
  },
  {
    title: 'Palindrome Number',
    slug: 'palindrome-number',
    description: '<p>An integer is a <strong>palindrome</strong> when it reads the same backward as forward. Given an integer <code>x</code>, return <code>true</code> if <code>x</code> is a palindrome, and <code>false</code> otherwise.</p>',
    difficulty: 'easy',
    category: 'math',
    companyTags: ['Wipro', 'HCL', 'Cognizant', 'Capgemini'],
    constraints: '-2^31 <= x <= 2^31 - 1',
    inputFormat: 'A single line containing the integer x.',
    outputFormat: 'Print "true" or "false" (lowercase).',
    examples: [
      { input: '121', output: 'true', explanation: '121 reads as 121 from left to right and from right to left.' },
      { input: '-121', output: 'false', explanation: 'From left to right, it reads -121. From right to left, it becomes 121-. Therefore it is not a palindrome.' }
    ],
    testCases: [
      { input: '121', expectedOutput: 'true', isHidden: false },
      { input: '-121', expectedOutput: 'false', isHidden: false },
      { input: '10', expectedOutput: 'false', isHidden: false },
      { input: '0', expectedOutput: 'true', isHidden: true },
      { input: '12321', expectedOutput: 'true', isHidden: true }
    ],
    solutionTemplates: {
      javascript: `// Palindrome Number in JavaScript
const x = parseInt(readline().trim());

function isPalindrome(x) {
    if (x < 0) return false;
    const str = x.toString();
    return str === str.split('').reverse().join('');
}

console.log(isPalindrome(x) ? 'true' : 'false');`,
      python: `# Palindrome Number in Python
import sys

def solve():
    lines = sys.stdin.read().splitlines()
    if not lines:
        return
    x_str = lines[0].strip()
    x = int(x_str)
    if x < 0:
        print("false")
    else:
        print("true" if x_str == x_str[::-1] else "false")

if __name__ == '__main__':
    solve()`,
      c: `#include <stdio.h>
#include <stdbool.h>

int main() {
    long long x;
    if (scanf("%lld", &x) == EOF) return 0;
    
    if (x < 0) {
        printf("false\\n");
        return 0;
    }
    
    long long original = x;
    long long reversed = 0;
    while (x > 0) {
        reversed = reversed * 10 + (x % 10);
        x /= 10;
    }
    
    if (original == reversed) {
        printf("true\\n");
    } else {
        printf("false\\n");
    }
    return 0;
}`,
      cpp: `#include <iostream>

using namespace std;

int main() {
    long long x;
    if (cin >> x) {
        if (x < 0) {
            cout << "false" << endl;
            return 0;
        }
        long long original = x;
        long long reversed = 0;
        while (x > 0) {
            reversed = reversed * 10 + (x % 10);
            x /= 10;
        }
        cout << (original == reversed ? "true" : "false") << endl;
    }
    return 0;
}`,
      java: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextLong()) {
            long x = sc.nextLong();
            if (x < 0) {
                System.out.println("false");
                return;
            }
            long original = x;
            long reversed = 0;
            while (x > 0) {
                reversed = reversed * 10 + (x % 10);
                x /= 10;
            }
            System.out.println(original == reversed ? "true" : "false");
        }
    }
}`
    },
    hints: ['Negative numbers cannot be palindromes due to the negative sign.', 'Try reversing the integer digit by digit without converting it to a string.'],
    acceptanceRate: 81.3
  },
  {
    title: 'Fibonacci Number',
    slug: 'fibonacci-number',
    description: '<p>The <b>Fibonacci numbers</b>, commonly denoted <code>F(n)</code> form a sequence, called the <b>Fibonacci sequence</b>, such that each number is the sum of the two preceding ones, starting from <code>0</code> and <code>1</code>.</p><p>Given <code>n</code>, calculate <code>F(n)</code>.</p>',
    difficulty: 'easy',
    category: 'math',
    companyTags: ['TCS', 'Infosys', 'Accenture', 'Wipro'],
    constraints: '0 <= n <= 30',
    inputFormat: 'A single line containing the integer n.',
    outputFormat: 'Print the value of F(n).',
    examples: [
      { input: '2', output: '1', explanation: 'F(2) = F(1) + F(0) = 1 + 0 = 1.' },
      { input: '4', output: '3', explanation: 'F(4) = F(3) + F(2) = 2 + 1 = 3.' }
    ],
    testCases: [
      { input: '2', expectedOutput: '1', isHidden: false },
      { input: '3', expectedOutput: '2', isHidden: false },
      { input: '4', expectedOutput: '3', isHidden: false },
      { input: '0', expectedOutput: '0', isHidden: true },
      { input: '10', expectedOutput: '55', isHidden: true }
    ],
    solutionTemplates: {
      javascript: `// Fibonacci Number in JavaScript
const n = parseInt(readline().trim());

function fib(n) {
    if (n <= 1) return n;
    let prev2 = 0, prev1 = 1;
    for (let i = 2; i <= n; i++) {
        let curr = prev2 + prev1;
        prev2 = prev1;
        prev1 = curr;
    }
    return prev1;
}

console.log(fib(n));`,
      python: `# Fibonacci Number in Python
import sys

def solve():
    lines = sys.stdin.read().splitlines()
    if not lines:
        return
    n = int(lines[0].strip())
    if n <= 1:
        print(n)
        return
    a, b = 0, 1
    for _ in range(2, n + 1):
        a, b = b, a + b
    print(b)

if __name__ == '__main__':
    solve()`,
      c: `#include <stdio.h>

int main() {
    int n;
    if (scanf("%d", &n) == EOF) return 0;
    
    if (n <= 1) {
        printf("%d\\n", n);
        return 0;
    }
    
    int prev2 = 0, prev1 = 1;
    for (int i = 2; i <= n; i++) {
        int curr = prev2 + prev1;
        prev2 = prev1;
        prev1 = curr;
    }
    printf("%d\\n", prev1);
    return 0;
}`,
      cpp: `#include <iostream>

using namespace std;

int main() {
    int n;
    if (cin >> n) {
        if (n <= 1) {
            cout << n << endl;
            return 0;
        }
        int prev2 = 0, prev1 = 1;
        for (int i = 2; i <= n; i++) {
            int curr = prev2 + prev1;
            prev2 = prev1;
            prev1 = curr;
        }
        cout << prev1 << endl;
    }
    return 0;
}`,
      java: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {
            int n = sc.nextInt();
            if (n <= 1) {
                System.out.println(n);
                return;
            }
            int prev2 = 0, prev1 = 1;
            for (int i = 2; i <= n; i++) {
                int curr = prev2 + prev1;
                prev2 = prev1;
                prev1 = curr;
            }
            System.out.println(prev1);
        }
    }
}`
    },
    hints: ['Recursion is simple but slow O(2^n). Use iterative approach for O(n) runtime.', 'Keep track of only the last two values to optimize space to O(1).'],
    acceptanceRate: 85.0
  },
  {
    title: 'Fizz Buzz',
    slug: 'fizz-buzz',
    description: '<p>Given an integer <code>n</code>, print the string representation of numbers from <code>1</code> to <code>n</code> separated by spaces.</p><p>But for multiples of three, print <code>"Fizz"</code> instead of the number, and for the multiples of five, print <code>"Buzz"</code>. For numbers which are multiples of both three and five, print <code>"FizzBuzz"</code>.</p>',
    difficulty: 'easy',
    category: 'math',
    companyTags: ['Wipro', 'HCL', 'Capgemini'],
    constraints: '1 <= n <= 10^4',
    inputFormat: 'A single line containing the integer n.',
    outputFormat: 'Print the FizzBuzz list from 1 to n separated by spaces.',
    examples: [
      { input: '3', output: '1 2 Fizz', explanation: '1, 2, and since 3 is divisible by 3, we print Fizz.' },
      { input: '5', output: '1 2 Fizz 4 Buzz', explanation: '3 -> Fizz, 5 -> Buzz.' }
    ],
    testCases: [
      { input: '3', expectedOutput: '1 2 Fizz', isHidden: false },
      { input: '5', expectedOutput: '1 2 Fizz 4 Buzz', isHidden: false },
      { input: '15', expectedOutput: '1 2 Fizz 4 Buzz Fizz 7 8 Fizz Buzz 11 Fizz 13 14 FizzBuzz', isHidden: false },
      { input: '1', expectedOutput: '1', isHidden: true },
      { input: '7', expectedOutput: '1 2 Fizz 4 Buzz Fizz 7', isHidden: true }
    ],
    solutionTemplates: {
      javascript: `// Fizz Buzz in JavaScript
const n = parseInt(readline().trim());

function fizzBuzz(n) {
    const res = [];
    for (let i = 1; i <= n; i++) {
        if (i % 3 === 0 && i % 5 === 0) res.push('FizzBuzz');
        else if (i % 3 === 0) res.push('Fizz');
        else if (i % 5 === 0) res.push('Buzz');
        else res.push(i.toString());
    }
    return res.join(' ');
}

console.log(fizzBuzz(n));`,
      python: `# Fizz Buzz in Python
import sys

def solve():
    lines = sys.stdin.read().splitlines()
    if not lines:
        return
    n = int(lines[0].strip())
    res = []
    for i in range(1, n + 1):
        if i % 3 == 0 and i % 5 == 0:
            res.append('FizzBuzz')
        elif i % 3 == 0:
            res.append('Fizz')
        elif i % 5 == 0:
            res.append('Buzz')
        else:
            res.append(str(i))
    print(' '.join(res))

if __name__ == '__main__':
    solve()`,
      c: `#include <stdio.h>

int main() {
    int n;
    if (scanf("%d", &n) == EOF) return 0;
    
    for (int i = 1; i <= n; i++) {
        if (i % 3 == 0 && i % 5 == 0) {
            printf("FizzBuzz");
        } else if (i % 3 == 0) {
            printf("Fizz");
        } else if (i % 5 == 0) {
            printf("Buzz");
        } else {
            printf("%d", i);
        }
        if (i < n) printf(" ");
    }
    printf("\\n");
    return 0;
}`,
      cpp: `#include <iostream>
#include <string>

using namespace std;

int main() {
    int n;
    if (cin >> n) {
        for (int i = 1; i <= n; i++) {
            if (i % 3 == 0 && i % 5 == 0) cout << "FizzBuzz";
            else if (i % 3 == 0) cout << "Fizz";
            else if (i % 5 == 0) cout << "Buzz";
            else cout << i;
            if (i < n) cout << " ";
        }
        cout << endl;
    }
    return 0;
}`,
      java: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {
            int n = sc.nextInt();
            StringBuilder sb = new StringBuilder();
            for (int i = 1; i <= n; i++) {
                if (i % 3 == 0 && i % 5 == 0) sb.append("FizzBuzz");
                else if (i % 3 == 0) sb.append("Fizz");
                else if (i % 5 == 0) sb.append("Buzz");
                else sb.append(i);
                if (i < n) sb.append(" ");
            }
            System.out.println(sb.toString());
        }
    }
}`
    },
    hints: ['Check modulo 15 (or both 3 and 5) first.', 'Be careful about the output format — space-separated and no trailing spaces if possible (though `.trim()` on the platform will handle simple whitespace).'],
    acceptanceRate: 92.5
  },
  {
    title: 'Valid Parentheses',
    slug: 'valid-parentheses',
    description: '<p>Given a string <code>s</code> containing just the characters <code>\'(\'</code>, <code>\')\'</code>, <code>\'{\'</code>, <code>\'}\'</code>, <code>\'[\'</code> and <code>\']\'</code>, determine if the input string is valid.</p><p>An input string is valid if:</p><ol><li>Open brackets must be closed by the same type of brackets.</li><li>Open brackets must be closed in the correct order.</li><li>Every close bracket has a corresponding open bracket of the same type.</li></ol>',
    difficulty: 'medium',
    category: 'strings',
    companyTags: ['TCS', 'Infosys', 'Accenture', 'Cognizant'],
    constraints: '1 <= s.length <= 10^4\ns consists of parentheses only \'()[]{}\'.',
    inputFormat: 'A single line containing the string s.',
    outputFormat: 'Print "true" or "false" (lowercase).',
    examples: [
      { input: '()', output: 'true', explanation: 'The bracket is closed correctly.' },
      { input: '()[]{}', output: 'true', explanation: 'All brackets are closed in correct type and order.' },
      { input: '(]', output: 'false', explanation: 'Open bracket ( is closed by wrong type ].' }
    ],
    testCases: [
      { input: '()', expectedOutput: 'true', isHidden: false },
      { input: '()[]{}', expectedOutput: 'true', isHidden: false },
      { input: '(]', expectedOutput: 'false', isHidden: false },
      { input: '([)]', expectedOutput: 'false', isHidden: true },
      { input: '{[]}', expectedOutput: 'true', isHidden: true }
    ],
    solutionTemplates: {
      javascript: `// Valid Parentheses in JavaScript
const s = readline().trim();

function isValid(s) {
    const stack = [];
    const map = {
        ')': '(',
        '}': '{',
        ']': '['
    };
    for (let char of s) {
        if (char in map) {
            const top = stack.length ? stack.pop() : '#';
            if (top !== map[char]) return false;
        } else {
            stack.push(char);
        }
    }
    return stack.length === 0;
}

console.log(isValid(s) ? 'true' : 'false');`,
      python: `# Valid Parentheses in Python
import sys

def isValid(s):
    stack = []
    mapping = {")": "(", "}": "{", "]": "["}
    for char in s:
        if char in mapping:
            top_element = stack.pop() if stack else '#'
            if mapping[char] != top_element:
                return False
        else:
            stack.append(char)
    return not stack

def solve():
    lines = sys.stdin.read().splitlines()
    if not lines:
        return
    s = lines[0].strip()
    print("true" if isValid(s) else "false")

if __name__ == '__main__':
    solve()`,
      c: `#include <stdio.h>
#include <string.h>
#include <stdbool.h>

bool isValid(char* s) {
    int len = strlen(s);
    char stack[10001];
    int top = -1;
    for (int i = 0; i < len; i++) {
        char c = s[i];
        if (c == '(' || c == '{' || c == '[') {
            stack[++top] = c;
        } else {
            if (top == -1) return false;
            if (c == ')' && stack[top] != '(') return false;
            if (c == '}' && stack[top] != '{') return false;
            if (c == ']' && stack[top] != '[') return false;
            top--;
        }
    }
    return top == -1;
}

int main() {
    char s[10001];
    if (scanf("%s", s) == EOF) return 0;
    printf("%s\\n", isValid(s) ? "true" : "false");
    return 0;
}`,
      cpp: `#include <iostream>
#include <string>
#include <stack>
#include <unordered_map>

using namespace std;

bool isValid(string s) {
    stack<char> st;
    unordered_map<char, char> m = {{')', '('}, {'}', '{'}, {']', '['}};
    for (char c : s) {
        if (m.find(c) != m.end()) {
            if (st.empty() || st.top() != m[c]) return false;
            st.pop();
        } else {
            st.push(c);
        }
    }
    return st.empty();
}

int main() {
    string s;
    if (cin >> s) {
        cout << (isValid(s) ? "true" : "false") << endl;
    }
    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    public static boolean isValid(String s) {
        Stack<Character> stack = new Stack<>();
        for (char c : s.toCharArray()) {
            if (c == '(' || c == '{' || c == '[') {
                stack.push(c);
            } else {
                if (stack.isEmpty()) return false;
                char top = stack.pop();
                if (c == ')' && top != '(') return false;
                if (c == '}' && top != '{') return false;
                if (c == ']' && top != '[') return false;
            }
        }
        return stack.isEmpty();
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNext()) {
            String s = sc.next();
            System.out.println(isValid(s) ? "true" : "false");
        }
    }
}`
    },
    hints: ['Use a stack data structure to keep track of open brackets.', 'When you encounter a closing bracket, check if it matches the top of the stack.'],
    acceptanceRate: 64.7
  },
  {
    title: 'Find Missing Number',
    slug: 'find-missing-number',
    description: '<p>Given an array <code>nums</code> containing <code>n</code> distinct numbers in the range <code>[0, n]</code>, return <em>the only number in the range that is missing from the array.</em></p>',
    difficulty: 'easy',
    category: 'arrays',
    companyTags: ['Wipro', 'Cognizant', 'HCL', 'TCS'],
    constraints: 'n == nums.length\n1 <= n <= 10^4\n0 <= nums[i] <= n\nAll the numbers of nums are unique.',
    inputFormat: 'First line contains N, the size of the array.\nSecond line contains N space-separated integers.',
    outputFormat: 'Print the missing integer.',
    examples: [
      { input: '3\n3 0 1', output: '2', explanation: 'n = 3 since there are 3 numbers, so all numbers are in the range [0,3]. 2 is the missing number in the range since it does not appear in nums.' },
      { input: '2\n0 1', output: '2', explanation: 'n = 2 since there are 2 numbers, so all numbers are in the range [0,2]. 2 is the missing number in the range.' }
    ],
    testCases: [
      { input: '3\n3 0 1', expectedOutput: '2', isHidden: false },
      { input: '2\n0 1', expectedOutput: '2', isHidden: false },
      { input: '9\n9 6 4 2 3 5 7 0 1', expectedOutput: '8', isHidden: false },
      { input: '1\n0', expectedOutput: '1', isHidden: true },
      { input: '5\n1 2 3 4 5', expectedOutput: '0', isHidden: true }
    ],
    solutionTemplates: {
      javascript: `// Find Missing Number in JavaScript
const n = parseInt(readline().trim());
const nums = readline().trim().split(' ').map(Number);

function missingNumber(nums) {
    const sum = nums.reduce((acc, val) => acc + val, 0);
    const len = nums.length;
    const expectedSum = (len * (len + 1)) / 2;
    return expectedSum - sum;
}

console.log(missingNumber(nums));`,
      python: `# Find Missing Number in Python
import sys

def solve():
    lines = sys.stdin.read().splitlines()
    if not lines:
        return
    n = int(lines[0].strip())
    nums = list(map(int, lines[1].strip().split()))
    
    expected_sum = (n * (n + 1)) // 2
    actual_sum = sum(nums)
    print(expected_sum - actual_sum)

if __name__ == '__main__':
    solve()`,
      c: `#include <stdio.h>
#include <stdlib.h>

int main() {
    int n;
    if (scanf("%d", &n) == EOF) return 0;
    
    int sum = 0;
    for (int i = 0; i < n; i++) {
        int val;
        if (scanf("%d", &val) == EOF) return 0;
        sum += val;
    }
    
    int expectedSum = (n * (n + 1)) / 2;
    printf("%d\\n", expectedSum - sum);
    return 0;
}`,
      cpp: `#include <iostream>
#include <vector>
#include <numeric>

using namespace std;

int main() {
    int n;
    if (cin >> n) {
        int sum = 0;
        for (int i = 0; i < n; i++) {
            int val;
            cin >> val;
            sum += val;
        }
        int expectedSum = (n * (n + 1)) / 2;
        cout << expectedSum - sum << endl;
    }
    return 0;
}`,
      java: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {
            int n = sc.nextInt();
            int sum = 0;
            for (int i = 0; i < n; i++) {
                sum += sc.nextInt();
            }
            int expectedSum = (n * (n + 1)) / 2;
            System.out.println(expectedSum - sum);
        }
    }
}`
    },
    hints: ['The sum of the first N integers is given by N * (N + 1) / 2.', 'Try using XOR operation. XOR-ing all numbers in range [0, N] and all numbers in the array leaves you with the missing number.'],
    acceptanceRate: 83.2
  },
  {
    title: 'Binary Search',
    slug: 'binary-search',
    description: '<p>Given an array of integers <code>nums</code> which is sorted in ascending order, and an integer <code>target</code>, write a function to search <code>target</code> in <code>nums</code>. If <code>target</code> exists, then return its index. Otherwise, return <code>-1</code>.</p><p>You must write an algorithm with <code>O(log n)</code> runtime complexity.</p>',
    difficulty: 'easy',
    category: 'sorting',
    companyTags: ['Infosys', 'Accenture', 'Cognizant', 'Capgemini'],
    constraints: '1 <= nums.length <= 10^4\n-10^4 < nums[i], target < 10^4\nAll the integers in nums are unique.\nnums is sorted in ascending order.',
    inputFormat: 'First line contains target.\nSecond line contains size of array, N.\nThird line contains N space-separated sorted integers.',
    outputFormat: 'Print the index of the target (0-based) if found, otherwise print -1.',
    examples: [
      { input: '9\n6\n-1 0 3 5 9 12', output: '4', explanation: '9 exists in nums and its index is 4.' },
      { input: '2\n6\n-1 0 3 5 9 12', output: '-1', explanation: '2 does not exist in nums so return -1.' }
    ],
    testCases: [
      { input: '9\n6\n-1 0 3 5 9 12', expectedOutput: '4', isHidden: false },
      { input: '2\n6\n-1 0 3 5 9 12', expectedOutput: '-1', isHidden: false },
      { input: '5\n1\n5', expectedOutput: '0', isHidden: false },
      { input: '-1\n6\n-1 0 3 5 9 12', expectedOutput: '0', isHidden: true },
      { input: '12\n6\n-1 0 3 5 9 12', expectedOutput: '5', isHidden: true }
    ],
    solutionTemplates: {
      javascript: `// Binary Search in JavaScript
const target = parseInt(readline().trim());
const n = parseInt(readline().trim());
const nums = readline().trim().split(' ').map(Number);

function search(nums, target) {
    let left = 0, right = nums.length - 1;
    while (left <= right) {
        let mid = Math.floor((left + right) / 2);
        if (nums[mid] === target) return mid;
        else if (nums[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}

console.log(search(nums, target));`,
      python: `# Binary Search in Python
import sys

def search(nums, target):
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = (left + right) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1

def solve():
    lines = sys.stdin.read().splitlines()
    if not lines:
        return
    target = int(lines[0].strip())
    n = int(lines[1].strip())
    nums = list(map(int, lines[2].strip().split()))
    
    print(search(nums, target))

if __name__ == '__main__':
    solve()`,
      c: `#include <stdio.h>
#include <stdlib.h>

int main() {
    int target, n;
    if (scanf("%d", &target) == EOF) return 0;
    if (scanf("%d", &n) == EOF) return 0;
    
    int* nums = (int*)malloc(n * sizeof(int));
    for (int i = 0; i < n; i++) {
        if (scanf("%d", &nums[i]) == EOF) return 0;
    }
    
    int left = 0, right = n - 1;
    int ans = -1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (nums[mid] == target) {
            ans = mid;
            break;
        } else if (nums[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    printf("%d\\n", ans);
    free(nums);
    return 0;
}`,
      cpp: `#include <iostream>
#include <vector>

using namespace std;

int main() {
    int target, n;
    if (!(cin >> target >> n)) return 0;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) {
        cin >> nums[i];
    }
    
    int left = 0, right = n - 1;
    int ans = -1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (nums[mid] == target) {
            ans = mid;
            break;
        } else if (nums[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    cout << ans << endl;
    return 0;
}`,
      java: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {
            int target = sc.nextInt();
            int n = sc.nextInt();
            int[] nums = new int[n];
            for (int i = 0; i < n; i++) {
                nums[i] = sc.nextInt();
            }
            
            int left = 0, right = n - 1;
            int ans = -1;
            while (left <= right) {
                int mid = left + (right - left) / 2;
                if (nums[mid] == target) {
                    ans = mid;
                    break;
                } else if (nums[mid] < target) {
                    left = mid + 1;
                } else {
                    right = mid - 1;
                }
            }
            System.out.println(ans);
        }
    }
}`
    },
    hints: ['Maintain two pointers: left and right.', 'Calculate mid and divide search space in half each iteration.'],
    acceptanceRate: 85.6
  },
  {
    title: 'Climbing Stairs',
    slug: 'climbing-stairs',
    description: '<p>You are climbing a staircase. It takes <code>n</code> steps to reach the top.</p><p>Each time you can either climb <code>1</code> or <code>2</code> steps. In how many distinct ways can you climb to the top?</p>',
    difficulty: 'medium',
    category: 'dp',
    companyTags: ['TCS', 'Infosys', 'Accenture'],
    constraints: '1 <= n <= 45',
    inputFormat: 'A single line containing the integer n.',
    outputFormat: 'Print the number of distinct ways.',
    examples: [
      { input: '2', output: '2', explanation: 'There are two ways to climb to the top:\n1. 1 step + 1 step\n2. 2 steps' },
      { input: '3', output: '3', explanation: 'There are three ways to climb to the top:\n1. 1 step + 1 step + 1 step\n2. 1 step + 2 steps\n3. 2 steps + 1 step' }
    ],
    testCases: [
      { input: '2', expectedOutput: '2', isHidden: false },
      { input: '3', expectedOutput: '3', isHidden: false },
      { input: '4', expectedOutput: '5', isHidden: false },
      { input: '5', expectedOutput: '8', isHidden: true },
      { input: '10', expectedOutput: '89', isHidden: true }
    ],
    solutionTemplates: {
      javascript: `// Climbing Stairs in JavaScript
const n = parseInt(readline().trim());

function climbStairs(n) {
    if (n <= 2) return n;
    let prev2 = 1, prev1 = 2;
    for (let i = 3; i <= n; i++) {
        let curr = prev2 + prev1;
        prev2 = prev1;
        prev1 = curr;
    }
    return prev1;
}

console.log(climbStairs(n));`,
      python: `# Climbing Stairs in Python
import sys

def solve():
    lines = sys.stdin.read().splitlines()
    if not lines:
        return
    n = int(lines[0].strip())
    if n <= 2:
        print(n)
        return
    prev2, prev1 = 1, 2
    for _ in range(3, n + 1):
        prev2, prev1 = prev1, prev2 + prev1
    print(prev1)

if __name__ == '__main__':
    solve()`,
      c: `#include <stdio.h>

int main() {
    int n;
    if (scanf("%d", &n) == EOF) return 0;
    
    if (n <= 2) {
        printf("%d\\n", n);
        return 0;
    }
    
    int prev2 = 1, prev1 = 2;
    for (int i = 3; i <= n; i++) {
        int curr = prev2 + prev1;
        prev2 = prev1;
        prev1 = curr;
    }
    printf("%d\\n", prev1);
    return 0;
}`,
      cpp: `#include <iostream>

using namespace std;

int main() {
    int n;
    if (cin >> n) {
        if (n <= 2) {
            cout << n << endl;
            return 0;
        }
        int prev2 = 1, prev1 = 2;
        for (int i = 3; i <= n; i++) {
            int curr = prev2 + prev1;
            prev2 = prev1;
            prev1 = curr;
        }
        cout << prev1 << endl;
    }
    return 0;
}`,
      java: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {
            int n = sc.nextInt();
            if (n <= 2) {
                System.out.println(n);
                return;
            }
            int prev2 = 1, prev1 = 2;
            for (int i = 3; i <= n; i++) {
                int curr = prev2 + prev1;
                prev2 = prev1;
                prev1 = curr;
            }
            System.out.println(prev1);
        }
    }
}`
    },
    hints: ['This is functionally equivalent to the Fibonacci sequence.', 'To reach step N, you could have come from step N-1 or step N-2. Thus, ways(N) = ways(N-1) + ways(N-2).'],
    acceptanceRate: 75.1
  },
  {
    title: 'Bubble Sort',
    slug: 'bubble-sort',
    description: '<p>Write a program to sort an array of integers using the <b>Bubble Sort</b> algorithm.</p><p>Bubble sort is a simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order. The pass through the list is repeated until the list is sorted.</p>',
    difficulty: 'easy',
    category: 'sorting',
    companyTags: ['Wipro', 'HCL', 'Capgemini'],
    constraints: '1 <= N <= 10^3\n-10^4 <= nums[i] <= 10^4',
    inputFormat: 'First line contains N, the number of elements.\nSecond line contains N space-separated integers.',
    outputFormat: 'Print the sorted array elements separated by spaces.',
    examples: [
      { input: '5\n5 1 4 2 8', output: '1 2 4 5 8', explanation: 'Bubble sort sorts 5 1 4 2 8 into 1 2 4 5 8.' }
    ],
    testCases: [
      { input: '5\n5 1 4 2 8', expectedOutput: '1 2 4 5 8', isHidden: false },
      { input: '3\n3 2 1', expectedOutput: '1 2 3', isHidden: false },
      { input: '1\n9', expectedOutput: '9', isHidden: false },
      { input: '4\n-1 -5 10 2', expectedOutput: '-5 -1 2 10', isHidden: true },
      { input: '6\n1 2 3 4 5 6', expectedOutput: '1 2 3 4 5 6', isHidden: true }
    ],
    solutionTemplates: {
      javascript: `// Bubble Sort in JavaScript
const n = parseInt(readline().trim());
const nums = readline().trim().split(' ').map(Number);

function bubbleSort(arr) {
    const len = arr.length;
    for (let i = 0; i < len; i++) {
        for (let j = 0; j < len - 1 - i; j++) {
            if (arr[j] > arr[j+1]) {
                const temp = arr[j];
                arr[j] = arr[j+1];
                arr[j+1] = temp;
            }
        }
    }
    return arr;
}

const sorted = bubbleSort(nums);
console.log(sorted.join(' '));`,
      python: `# Bubble Sort in Python
import sys

def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n - i - 1):
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]
    return arr

def solve():
    lines = sys.stdin.read().splitlines()
    if not lines:
        return
    n = int(lines[0].strip())
    arr = list(map(int, lines[1].strip().split()))
    
    sorted_arr = bubble_sort(arr)
    print(' '.join(map(str, sorted_arr)))

if __name__ == '__main__':
    solve()`,
      c: `#include <stdio.h>
#include <stdlib.h>

void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j+1]) {
                int temp = arr[j];
                arr[j] = arr[j+1];
                arr[j+1] = temp;
            }
        }
    }
}

int main() {
    int n;
    if (scanf("%d", &n) == EOF) return 0;
    
    int* arr = (int*)malloc(n * sizeof(int));
    for (int i = 0; i < n; i++) {
        if (scanf("%d", &arr[i]) == EOF) return 0;
    }
    
    bubbleSort(arr, n);
    
    for (int i = 0; i < n; i++) {
        printf("%d", arr[i]);
        if (i < n - 1) printf(" ");
    }
    printf("\\n");
    
    free(arr);
    return 0;
}`,
      cpp: `#include <iostream>
#include <vector>

using namespace std;

void bubbleSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j+1]) {
                swap(arr[j], arr[j+1]);
            }
        }
    }
}

int main() {
    int n;
    if (cin >> n) {
        vector<int> arr(n);
        for (int i = 0; i < n; i++) {
            cin >> arr[i];
        }
        bubbleSort(arr);
        for (int i = 0; i < n; i++) {
            cout << arr[i];
            if (i < n - 1) cout << " ";
        }
        cout << endl;
    }
    return 0;
}`,
      java: `import java.util.Scanner;

public class Solution {
    public static void bubbleSort(int[] arr) {
        int n = arr.length;
        for (int i = 0; i < n - 1; i++) {
            for (int j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j+1]) {
                    int temp = arr[j];
                    arr[j] = arr[j+1];
                    arr[j+1] = temp;
                }
            }
        }
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {
            int n = sc.nextInt();
            int[] arr = new int[n];
            for (int i = 0; i < n; i++) {
                arr[i] = sc.nextInt();
            }
            bubbleSort(arr);
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < n; i++) {
                sb.append(arr[i]);
                if (i < n - 1) sb.append(" ");
            }
            System.out.println(sb.toString());
        }
    }
}`
    },
    hints: ['Perform nested loops: the outer loop handles the passes and the inner loop performs adjacent comparisons.', 'In each pass, the largest unsorted element "bubbles" up to its correct position.'],
    acceptanceRate: 89.2
  },
  {
    title: 'Maximum Subarray (Kadane\'s)',
    slug: 'maximum-subarray-kadanes',
    description: '<p>Given an integer array <code>nums</code>, find the subarray with the largest sum, and return <em>its sum</em>.</p><p>A <strong>subarray</strong> is a contiguous non-empty sequence of elements within an array.</p>',
    difficulty: 'medium',
    category: 'arrays',
    companyTags: ['Infosys', 'Cognizant', 'Accenture', 'TCS'],
    constraints: '1 <= nums.length <= 10^5\n-10^4 <= nums[i] <= 10^4',
    inputFormat: 'First line contains N, the size of array.\nSecond line contains N space-separated integers.',
    outputFormat: 'Print a single integer representing the maximum subarray sum.',
    examples: [
      { input: '9\n-2 1 -3 4 -1 2 1 -5 4', output: '6', explanation: 'The subarray [4,-1,2,1] has the largest sum = 6.' }
    ],
    testCases: [
      { input: '9\n-2 1 -3 4 -1 2 1 -5 4', expectedOutput: '6', isHidden: false },
      { input: '1\n5', expectedOutput: '5', isHidden: false },
      { input: '5\n5 4 -1 7 8', expectedOutput: '23', isHidden: false },
      { input: '4\n-1 -2 -3 -4', expectedOutput: '-1', isHidden: true },
      { input: '6\n-2 3 -1 2 -5 6', expectedOutput: '6', isHidden: true }
    ],
    solutionTemplates: {
      javascript: `// Kadane's in JavaScript
const n = parseInt(readline().trim());
const nums = readline().trim().split(' ').map(Number);

function maxSubArray(nums) {
    let maxSoFar = nums[0];
    let currMax = nums[0];
    for (let i = 1; i < nums.length; i++) {
        currMax = Math.max(nums[i], currMax + nums[i]);
        maxSoFar = Math.max(maxSoFar, currMax);
    }
    return maxSoFar;
}

console.log(maxSubArray(nums));`,
      python: `# Kadane's in Python
import sys

def maxSubArray(nums):
    max_so_far = nums[0]
    curr_max = nums[0]
    for num in nums[1:]:
        curr_max = max(num, curr_max + num)
        max_so_far = max(max_so_far, curr_max)
    return max_so_far

def solve():
    lines = sys.stdin.read().splitlines()
    if not lines:
        return
    n = int(lines[0].strip())
    nums = list(map(int, lines[1].strip().split()))
    print(maxSubArray(nums))

if __name__ == '__main__':
    solve()`,
      c: `#include <stdio.h>
#include <stdlib.h>

long long max(long long a, long long b) {
    return a > b ? a : b;
}

int main() {
    int n;
    if (scanf("%d", &n) == EOF) return 0;
    
    long long* nums = (long long*)malloc(n * sizeof(long long));
    for (int i = 0; i < n; i++) {
        if (scanf("%lld", &nums[i]) == EOF) return 0;
    }
    
    long long maxSoFar = nums[0];
    long long currMax = nums[0];
    for (int i = 1; i < n; i++) {
        currMax = max(nums[i], currMax + nums[i]);
        maxSoFar = max(maxSoFar, currMax);
    }
    
    printf("%lld\\n", maxSoFar);
    free(nums);
    return 0;
}`,
      cpp: `#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

int main() {
    int n;
    if (cin >> n) {
        vector<int> nums(n);
        for (int i = 0; i < n; i++) {
            cin >> nums[i];
        }
        
        int maxSoFar = nums[0];
        int currMax = nums[0];
        for (int i = 1; i < n; i++) {
            currMax = max(nums[i], currMax + nums[i]);
            maxSoFar = max(maxSoFar, currMax);
        }
        cout << maxSoFar << endl;
    }
    return 0;
}`,
      java: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {
            int n = sc.nextInt();
            int[] nums = new int[n];
            for (int i = 0; i < n; i++) {
                nums[i] = sc.nextInt();
            }
            
            int maxSoFar = nums[0];
            int currMax = nums[0];
            for (int i = 1; i < n; i++) {
                currMax = Math.max(nums[i], currMax + nums[i]);
                maxSoFar = Math.max(maxSoFar, currMax);
            }
            System.out.println(maxSoFar);
        }
    }
}`
    },
    hints: ['If all elements are negative, the maximum subarray is just the largest single negative element.', 'Use Kadane\'s algorithm: iterate through the array, updating local maximum sum as max(x, current_sum + x).'],
    acceptanceRate: 70.3
  },
  {
    title: 'Merge Sorted Arrays',
    slug: 'merge-sorted-arrays',
    description: '<p>You are given two integer arrays <code>nums1</code> and <code>nums2</code>, sorted in non-decreasing order.</p><p>Merge them into a single sorted array, and print the merged array elements separated by a space.</p>',
    difficulty: 'easy',
    category: 'arrays',
    companyTags: ['Accenture', 'Capgemini', 'Wipro'],
    constraints: '1 <= nums1.length, nums2.length <= 1000\n-10^5 <= nums1[i], nums2[j] <= 10^5',
    inputFormat: 'First line contains M and N (sizes of nums1 and nums2 respectively) separated by space.\nSecond line contains M space-separated integers of nums1.\nThird line contains N space-separated integers of nums2.',
    outputFormat: 'Print the merged sorted array elements separated by spaces.',
    examples: [
      { input: '3 3\n1 3 5\n2 4 6', output: '1 2 3 4 5 6', explanation: 'Merging the two sorted arrays [1,3,5] and [2,4,6] gives [1,2,3,4,5,6].' }
    ],
    testCases: [
      { input: '3 3\n1 3 5\n2 4 6', expectedOutput: '1 2 3 4 5 6', isHidden: false },
      { input: '1 1\n0\n1', expectedOutput: '0 1', isHidden: false },
      { input: '4 2\n1 2 5 7\n3 4', expectedOutput: '1 2 3 4 5 7', isHidden: false },
      { input: '2 3\n-5 10\n-10 0 20', expectedOutput: '-10 -5 0 10 20', isHidden: true },
      { input: '3 1\n1 2 3\n4', expectedOutput: '1 2 3 4', isHidden: true }
    ],
    solutionTemplates: {
      javascript: `// Merge Sorted Arrays in JavaScript
const [m, n] = readline().trim().split(' ').map(Number);
const nums1 = readline().trim().split(' ').map(Number);
const nums2 = readline().trim().split(' ').map(Number);

function merge(nums1, m, nums2, n) {
    const res = [];
    let i = 0, j = 0;
    while (i < m && j < n) {
        if (nums1[i] <= nums2[j]) {
            res.push(nums1[i++]);
        } else {
            res.push(nums2[j++]);
        }
    }
    while (i < m) res.push(nums1[i++]);
    while (j < n) res.push(nums2[j++]);
    return res;
}

console.log(merge(nums1, m, nums2, n).join(' '));`,
      python: `# Merge Sorted Arrays in Python
import sys

def solve():
    lines = sys.stdin.read().splitlines()
    if not lines:
        return
    m, n = map(int, lines[0].strip().split())
    nums1 = list(map(int, lines[1].strip().split()))
    nums2 = list(map(int, lines[2].strip().split()))
    
    res = []
    i, j = 0, 0
    while i < m and j < n:
        if nums1[i] <= nums2[j]:
            res.append(nums1[i])
            i += 1
        else:
            res.append(nums2[j])
            j += 1
    while i < m:
        res.append(nums1[i])
        i += 1
    while j < n:
        res.append(nums2[j])
        j += 1
        
    print(' '.join(map(str, res)))

if __name__ == '__main__':
    solve()`,
      c: `#include <stdio.h>
#include <stdlib.h>

int main() {
    int m, n;
    if (scanf("%d %d", &m, &n) == EOF) return 0;
    
    int* nums1 = (int*)malloc(m * sizeof(int));
    for (int i = 0; i < m; i++) {
        if (scanf("%d", &nums1[i]) == EOF) return 0;
    }
    
    int* nums2 = (int*)malloc(n * sizeof(int));
    for (int i = 0; i < n; i++) {
        if (scanf("%d", &nums2[i]) == EOF) return 0;
    }
    
    int i = 0, j = 0;
    while (i < m && j < n) {
        if (nums1[i] <= nums2[j]) {
            printf("%d", nums1[i++]);
        } else {
            printf("%d", nums2[j++]);
        }
        if (i < m || j < n) printf(" ");
    }
    while (i < m) {
        printf("%d", nums1[i++]);
        if (i < m) printf(" ");
    }
    while (j < n) {
        printf("%d", nums2[j++]);
        if (j < n) printf(" ");
    }
    printf("\\n");
    
    free(nums1);
    free(nums2);
    return 0;
}`,
      cpp: `#include <iostream>
#include <vector>

using namespace std;

int main() {
    int m, n;
    if (cin >> m >> n) {
        vector<int> nums1(m), nums2(n);
        for (int i = 0; i < m; i++) cin >> nums1[i];
        for (int i = 0; i < n; i++) cin >> nums2[i];
        
        int i = 0, j = 0;
        vector<int> res;
        while (i < m && j < n) {
            if (nums1[i] <= nums2[j]) {
                res.push_back(nums1[i++]);
            } else {
                res.push_back(nums2[j++]);
            }
        }
        while (i < m) res.push_back(nums1[i++]);
        while (j < n) res.push_back(nums2[j++]);
        
        for (int k = 0; k < res.size(); k++) {
            cout << res[k];
            if (k < res.size() - 1) cout << " ";
        }
        cout << endl;
    }
    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {
            int m = sc.nextInt();
            int n = sc.nextInt();
            int[] nums1 = new int[m];
            for (int i = 0; i < m; i++) nums1[i] = sc.nextInt();
            int[] nums2 = new int[n];
            for (int i = 0; i < n; i++) nums2[i] = sc.nextInt();
            
            int i = 0, j = 0;
            StringBuilder sb = new StringBuilder();
            while (i < m && j < n) {
                if (nums1[i] <= nums2[j]) {
                    sb.append(nums1[i++]);
                } else {
                    sb.append(nums2[j++]);
                }
                sb.append(" ");
            }
            while (i < m) sb.append(nums1[i++]).append(" ");
            while (j < n) sb.append(nums2[j++]).append(" ");
            System.out.println(sb.toString().trim());
        }
    }
}`
    },
    hints: ['Use the two-pointer technique to compare elements in both arrays.', 'Make sure to append any remaining elements from either array.'],
    acceptanceRate: 84.1
  },
  {
    title: 'Is Prime',
    slug: 'is-prime',
    description: '<p>Given a positive integer <code>n</code>, write a program to check if <code>n</code> is a <strong>prime number</strong> or not.</p><p>A prime number is a number greater than 1 that has no positive divisors other than 1 and itself.</p>',
    difficulty: 'easy',
    category: 'math',
    companyTags: ['TCS', 'Capgemini', 'HCL', 'Wipro'],
    constraints: '1 <= n <= 10^9',
    inputFormat: 'A single line containing the integer n.',
    outputFormat: 'Print "true" if n is prime, and "false" otherwise.',
    examples: [
      { input: '7', output: 'true', explanation: '7 is only divisible by 1 and 7, so it is a prime number.' },
      { input: '4', output: 'false', explanation: '4 is divisible by 2, so it is not a prime number.' }
    ],
    testCases: [
      { input: '7', expectedOutput: 'true', isHidden: false },
      { input: '4', expectedOutput: 'false', isHidden: false },
      { input: '1', expectedOutput: 'false', isHidden: false },
      { input: '2', expectedOutput: 'true', isHidden: true },
      { input: '997', expectedOutput: 'true', isHidden: true }
    ],
    solutionTemplates: {
      javascript: `// Is Prime in JavaScript
const n = parseInt(readline().trim());

function isPrime(n) {
    if (n <= 1) return false;
    if (n === 2) return true;
    if (n % 2 === 0) return false;
    for (let i = 3; i * i <= n; i += 2) {
        if (n % i === 0) return false;
    }
    return true;
}

console.log(isPrime(n) ? 'true' : 'false');`,
      python: `# Is Prime in Python
import sys

def is_prime(n):
    if n <= 1:
        return False
    if n == 2:
        return True
    if n % 2 == 0:
        return False
    i = 3
    while i * i <= n:
        if n % i == 0:
            return False
        i += 2
    return True

def solve():
    lines = sys.stdin.read().splitlines()
    if not lines:
        return
    n = int(lines[0].strip())
    print("true" if is_prime(n) else "false")

if __name__ == '__main__':
    solve()`,
      c: `#include <stdio.h>
#include <stdbool.h>

bool isPrime(int n) {
    if (n <= 1) return false;
    if (n == 2) return true;
    if (n % 2 == 0) return false;
    for (int i = 3; i * i <= n; i += 2) {
        if (n % i == 0) return false;
    }
    return true;
}

int main() {
    int n;
    if (scanf("%d", &n) == EOF) return 0;
    printf("%s\\n", isPrime(n) ? "true" : "false");
    return 0;
}`,
      cpp: `#include <iostream>

using namespace std;

bool isPrime(int n) {
    if (n <= 1) return false;
    if (n == 2) return true;
    if (n % 2 == 0) return false;
    for (int i = 3; i * i <= n; i += 2) {
        if (n % i == 0) return false;
    }
    return true;
}

int main() {
    int n;
    if (cin >> n) {
        cout << (isPrime(n) ? "true" : "false") << endl;
    }
    return 0;
}`,
      java: `import java.util.Scanner;

public class Solution {
    public static boolean isPrime(int n) {
        if (n <= 1) return false;
        if (n == 2) return true;
        if (n % 2 == 0) return false;
        for (int i = 3; i * i <= n; i += 2) {
            if (n % i == 0) return false;
        }
        return true;
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {
            int n = sc.nextInt();
            System.out.println(isPrime(n) ? "true" : "false");
        }
    }
}`
    },
    hints: ['Check if n is less than or equal to 1 first (not prime).', 'Iterate from 3 to sqrt(n) stepping by 2 to check for factors. If any factor is found, return false.'],
    acceptanceRate: 82.5
  },
  {
    title: 'Valid Anagram',
    slug: 'valid-anagram',
    description: '<p>Given two strings <code>s</code> and <code>t</code>, return <code>true</code> <em>if <code>t</code> is an anagram of <code>s</code>, and <code>false</code> otherwise</em>.</p><p>An <strong>Anagram</strong> is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.</p>',
    difficulty: 'easy',
    category: 'strings',
    companyTags: ['Cognizant', 'Wipro', 'TCS', 'Infosys'],
    constraints: '1 <= s.length, t.length <= 5 * 10^4\ns and t consist of lowercase English letters.',
    inputFormat: 'First line contains string s.\nSecond line contains string t.',
    outputFormat: 'Print "true" if they are anagrams, and "false" otherwise.',
    examples: [
      { input: 'anagram\nnagaram', output: 'true', explanation: 'Both words contain the same letters in different order.' },
      { input: 'rat\ncar', output: 'false', explanation: 'Letters do not match.' }
    ],
    testCases: [
      { input: 'anagram\nnagaram', expectedOutput: 'true', isHidden: false },
      { input: 'rat\ncar', expectedOutput: 'false', isHidden: false },
      { input: 'a\na', expectedOutput: 'true', isHidden: false },
      { input: 'ab\na', expectedOutput: 'false', isHidden: true },
      { input: 'awesome\nsomeawe', expectedOutput: 'true', isHidden: true }
    ],
    solutionTemplates: {
      javascript: `// Valid Anagram in JavaScript
const s = readline().trim();
const t = readline().trim();

function isAnagram(s, t) {
    if (s.length !== t.length) return false;
    return s.split('').sort().join('') === t.split('').sort().join('');
}

console.log(isAnagram(s, t) ? 'true' : 'false');`,
      python: `# Valid Anagram in Python
import sys

def isAnagram(s, t):
    if len(s) != len(t):
        return False
    return sorted(s) == sorted(t)

def solve():
    lines = sys.stdin.read().splitlines()
    if len(lines) < 2:
        return
    s = lines[0].strip()
    t = lines[1].strip()
    print("true" if isAnagram(s, t) else "false")

if __name__ == '__main__':
    solve()`,
      c: `#include <stdio.h>
#include <string.h>
#include <stdbool.h>

bool isAnagram(char* s, char* t) {
    int lenS = strlen(s);
    int lenT = strlen(t);
    if (lenS != lenT) return false;
    
    int count[26] = {0};
    for (int i = 0; i < lenS; i++) {
        count[s[i] - 'a']++;
        count[t[i] - 'a']--;
    }
    
    for (int i = 0; i < 26; i++) {
        if (count[i] != 0) return false;
    }
    return true;
}

int main() {
    char s[50001], t[50001];
    if (scanf("%s %s", s, t) == EOF) return 0;
    printf("%s\\n", isAnagram(s, t) ? "true" : "false");
    return 0;
}`,
      cpp: `#include <iostream>
#include <string>
#include <vector>

using namespace std;

bool isAnagram(string s, string t) {
    if (s.length() != t.length()) return false;
    vector<int> count(26, 0);
    for (int i = 0; i < s.length(); i++) {
        count[s[i] - 'a']++;
        count[t[i] - 'a']--;
    }
    for (int val : count) {
        if (val != 0) return false;
    }
    return true;
}

int main() {
    string s, t;
    if (cin >> s >> t) {
        cout << (isAnagram(s, t) ? "true" : "false") << endl;
    }
    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    public static boolean isAnagram(String s, String t) {
        if (s.length() != t.length()) return false;
        int[] count = new int[26];
        for (int i = 0; i < s.length(); i++) {
            count[s.charAt(i) - 'a']++;
            count[t.charAt(i) - 'a']--;
        }
        for (int val : count) {
            if (val != 0) return false;
        }
        return true;
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNext()) {
            String s = sc.next();
            if (sc.hasNext()) {
                String t = sc.next();
                System.out.println(isAnagram(s, t) ? "true" : "false");
            }
        }
    }
}`
    },
    hints: ['Sort the two strings and compare them.', 'Use a frequency counter array of size 26 for letters to make it O(n) runtime instead of sorting.'],
    acceptanceRate: 86.4
  },
  {
    title: 'Single Number',
    slug: 'single-number',
    description: '<p>Given a <strong>non-empty</strong> array of integers <code>nums</code>, every element appears <em>twice</em> except for one. Find that single one.</p><p>You must implement a solution with a linear runtime complexity and use only constant extra space.</p>',
    difficulty: 'easy',
    category: 'arrays',
    companyTags: ['TCS', 'Wipro', 'Infosys', 'Accenture'],
    constraints: '1 <= nums.length <= 3 * 10^4\n-3 * 10^4 <= nums[i] <= 3 * 10^4\nEach element in the array appears twice except for one element which appears only once.',
    inputFormat: 'First line contains N, the array size.\nSecond line contains N space-separated integers.',
    outputFormat: 'Print the single integer.',
    examples: [
      { input: '3\n2 2 1', output: '1', explanation: 'All elements appear twice except 1, which appears once.' },
      { input: '5\n4 1 2 1 2', output: '4', explanation: 'All elements appear twice except 4, which appears once.' }
    ],
    testCases: [
      { input: '3\n2 2 1', expectedOutput: '1', isHidden: false },
      { input: '5\n4 1 2 1 2', expectedOutput: '4', isHidden: false },
      { input: '1\n1', expectedOutput: '1', isHidden: false },
      { input: '7\n9 3 5 3 5 9 8', expectedOutput: '8', isHidden: true },
      { input: '9\n1 2 3 4 5 1 2 3 4', expectedOutput: '5', isHidden: true }
    ],
    solutionTemplates: {
      javascript: `// Single Number in JavaScript
const n = parseInt(readline().trim());
const nums = readline().trim().split(' ').map(Number);

function singleNumber(nums) {
    let result = 0;
    for (let num of nums) {
        result ^= num;
    }
    return result;
}

console.log(singleNumber(nums));`,
      python: `# Single Number in Python
import sys

def solve():
    lines = sys.stdin.read().splitlines()
    if not lines:
        return
    n = int(lines[0].strip())
    nums = list(map(int, lines[1].strip().split()))
    
    result = 0
    for num in nums:
        result ^= num
    print(result)

if __name__ == '__main__':
    solve()`,
      c: `#include <stdio.h>
#include <stdlib.h>

int main() {
    int n;
    if (scanf("%d", &n) == EOF) return 0;
    
    int result = 0;
    for (int i = 0; i < n; i++) {
        int val;
        if (scanf("%d", &val) == EOF) return 0;
        result ^= val;
    }
    
    printf("%d\\n", result);
    return 0;
}`,
      cpp: `#include <iostream>
#include <vector>

using namespace std;

int main() {
    int n;
    if (cin >> n) {
        int result = 0;
        for (int i = 0; i < n; i++) {
            int val;
            cin >> val;
            result ^= val;
        }
        cout << result << endl;
    }
    return 0;
}`,
      java: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {
            int n = sc.nextInt();
            int result = 0;
            for (int i = 0; i < n; i++) {
                result ^= sc.nextInt();
            }
            System.out.println(result);
        }
    }
}`
    },
    hints: ['If we take XOR of zero and some bit, it will return that bit.', 'If we take XOR of two same bits, it will return 0. So a ^ b ^ a = (a ^ a) ^ b = 0 ^ b = b.'],
    acceptanceRate: 89.9
  },
  {
    title: 'Coin Change',
    slug: 'coin-change',
    description: '<p>You are given an integer array <code>coins</code> representing coins of different denominations and an integer <code>amount</code> representing a total amount of money.</p><p>Return <em>the fewest number of coins that you need to make up that amount</em>. If that amount of money cannot be made up by any combination of the coins, return <code>-1</code>.</p><p>You may assume that you have an infinite number of each kind of coin.</p>',
    difficulty: 'medium',
    category: 'dp',
    companyTags: ['Cognizant', 'Accenture', 'Infosys'],
    constraints: '1 <= coins.length <= 12\n1 <= coins[i] <= 2^31 - 1\n0 <= amount <= 10^4',
    inputFormat: 'First line contains amount.\nSecond line contains size of coins, N.\nThird line contains N space-separated coin values.',
    outputFormat: 'Print a single integer representing the minimum number of coins.',
    examples: [
      { input: '11\n3\n1 2 5', output: '3', explanation: '11 = 5 + 5 + 1' },
      { input: '3\n1\n2', output: '-1', explanation: 'Cannot make 3 with only 2-cent coins.' }
    ],
    testCases: [
      { input: '11\n3\n1 2 5', expectedOutput: '3', isHidden: false },
      { input: '3\n1\n2', expectedOutput: '-1', isHidden: false },
      { input: '0\n1\n1', expectedOutput: '0', isHidden: false },
      { input: '6249\n4\n186 419 83 408', expectedOutput: '20', isHidden: true },
      { input: '4\n2\n2 3', expectedOutput: '2', isHidden: true }
    ],
    solutionTemplates: {
      javascript: `// Coin Change in JavaScript
const amount = parseInt(readline().trim());
const n = parseInt(readline().trim());
const coins = readline().trim().split(' ').map(Number);

function coinChange(coins, amount) {
    const dp = Array(amount + 1).fill(amount + 1);
    dp[0] = 0;
    for (let i = 1; i <= amount; i++) {
        for (let coin of coins) {
            if (i - coin >= 0) {
                dp[i] = Math.min(dp[i], dp[i - coin] + 1);
            }
        }
    }
    return dp[amount] > amount ? -1 : dp[amount];
}

console.log(coinChange(coins, amount));`,
      python: `# Coin Change in Python
import sys

def coinChange(coins, amount):
    dp = [amount + 1] * (amount + 1)
    dp[0] = 0
    for i in range(1, amount + 1):
        for coin in coins:
            if i - coin >= 0:
                dp[i] = min(dp[i], dp[i - coin] + 1)
    return dp[amount] if dp[amount] <= amount else -1

def solve():
    lines = sys.stdin.read().splitlines()
    if not lines:
        return
    amount = int(lines[0].strip())
    n = int(lines[1].strip())
    coins = list(map(int, lines[2].strip().split()))
    
    print(coinChange(coins, amount))

if __name__ == '__main__':
    solve()`,
      c: `#include <stdio.h>
#include <stdlib.h>

int min(int a, int b) {
    return a < b ? a : b;
}

int main() {
    int amount, n;
    if (scanf("%d", &amount) == EOF) return 0;
    if (scanf("%d", &n) == EOF) return 0;
    
    int* coins = (int*)malloc(n * sizeof(int));
    for (int i = 0; i < n; i++) {
        if (scanf("%d", &coins[i]) == EOF) return 0;
    }
    
    int* dp = (int*)malloc((amount + 1) * sizeof(int));
    dp[0] = 0;
    for (int i = 1; i <= amount; i++) {
        dp[i] = amount + 1;
        for (int j = 0; j < n; j++) {
            if (i - coins[j] >= 0) {
                dp[i] = min(dp[i], dp[i - coins[j]] + 1);
            }
        }
    }
    
    int result = dp[amount] > amount ? -1 : dp[amount];
    printf("%d\\n", result);
    
    free(coins);
    free(dp);
    return 0;
}`,
      cpp: `#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

int main() {
    int amount, n;
    if (cin >> amount >> n) {
        vector<int> coins(n);
        for (int i = 0; i < n; i++) cin >> coins[i];
        
        vector<int> dp(amount + 1, amount + 1);
        dp[0] = 0;
        for (int i = 1; i <= amount; i++) {
            for (int coin : coins) {
                if (i - coin >= 0) {
                    dp[i] = min(dp[i], dp[i - coin] + 1);
                }
            }
        }
        cout << (dp[amount] > amount ? -1 : dp[amount]) << endl;
    }
    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {
            int amount = sc.nextInt();
            int n = sc.nextInt();
            int[] coins = new int[n];
            for (int i = 0; i < n; i++) coins[i] = sc.nextInt();
            
            int[] dp = new int[amount + 1];
            Arrays.fill(dp, amount + 1);
            dp[0] = 0;
            for (int i = 1; i <= amount; i++) {
                for (int coin : coins) {
                    if (i - coin >= 0) {
                        dp[i] = Math.min(dp[i], dp[i - coin] + 1);
                    }
                }
            }
            System.out.println(dp[amount] > amount ? -1 : dp[amount]);
        }
    }
}`
    },
    hints: ['Try using dynamic programming. dp[i] represents the minimum coins to make amount i.', ' dp[i] = min(dp[i], dp[i - coin] + 1) for every coin available.'],
    acceptanceRate: 61.2
  },
  {
    title: 'Job Sequencing Problem',
    slug: 'job-sequencing-problem',
    description: '<p>Given a set of <code>N</code> jobs where each job <code>i</code> has a deadline and profit associated with it. Each job takes <code>1</code> unit of time to complete and only one job can be scheduled at any time. We earn the profit if and only if the job is completed before its deadline.</p><p>Find the maximum profit you can earn by sequencing the jobs optimally.</p>',
    difficulty: 'medium',
    category: 'greedy',
    companyTags: ['Wipro', 'Infosys', 'TCS'],
    constraints: '1 <= N <= 1000\n1 <= Deadline <= 100\n1 <= Profit <= 1000',
    inputFormat: 'First line contains N, the number of jobs.\nFollowing N lines contain two space-separated integers representing Deadline and Profit for each job.',
    outputFormat: 'Print a single integer representing the maximum profit.',
    examples: [
      { input: '4\n4 20\n1 10\n1 40\n1 30', output: '60', explanation: 'Optimal sequence of jobs is Job 3 (profit 40) at slot 1, and Job 1 (profit 20) at slot 2, 3, or 4. Max profit = 40 + 20 = 60.' }
    ],
    testCases: [
      { input: '4\n4 20\n1 10\n1 40\n1 30', expectedOutput: '60', isHidden: false },
      { input: '5\n2 100\n1 19\n2 27\n1 25\n3 15', expectedOutput: '142', isHidden: false },
      { input: '3\n1 10\n1 20\n1 30', expectedOutput: '30', isHidden: false },
      { input: '2\n2 50\n1 10', expectedOutput: '60', isHidden: true },
      { input: '6\n3 40\n1 10\n1 50\n1 60\n3 20\n2 30', expectedOutput: '130', isHidden: true }
    ],
    solutionTemplates: {
      javascript: `// Job Sequencing in JavaScript
const n = parseInt(readline().trim());
const jobs = [];
for (let i = 0; i < n; i++) {
    const [deadline, profit] = readline().trim().split(' ').map(Number);
    jobs.push({ deadline, profit });
}

function getMaxProfit(jobs) {
    jobs.sort((a, b) => b.profit - a.profit);
    const maxDeadline = Math.max(...jobs.map(j => j.deadline));
    const slots = Array(maxDeadline + 1).fill(false);
    let totalProfit = 0;
    
    for (let job of jobs) {
        for (let j = job.deadline; j > 0; j--) {
            if (!slots[j]) {
                slots[j] = true;
                totalProfit += job.profit;
                break;
            }
        }
    }
    return totalProfit;
}

console.log(getMaxProfit(jobs));`,
      python: `# Job Sequencing in Python
import sys

def solve():
    lines = sys.stdin.read().splitlines()
    if not lines:
        return
    n = int(lines[0].strip())
    jobs = []
    for i in range(1, n + 1):
        deadline, profit = map(int, lines[i].strip().split())
        jobs.append((deadline, profit))
        
    jobs.sort(key=lambda x: x[1], reverse=True)
    max_dl = max(j[0] for j in jobs)
    slots = [False] * (max_dl + 1)
    total_profit = 0
    
    for job in jobs:
        dl, profit = job
        for s in range(dl, 0, -1):
            if not slots[s]:
                slots[s] = True
                total_profit += profit
                break
                
    print(total_profit)

if __name__ == '__main__':
    solve()`,
      c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

typedef struct {
    int deadline;
    int profit;
} Job;

int compare(const void* a, const void* b) {
    return ((Job*)b)->profit - ((Job*)a)->profit;
}

int main() {
    int n;
    if (scanf("%d", &n) == EOF) return 0;
    
    Job* jobs = (Job*)malloc(n * sizeof(Job));
    int maxDeadline = 0;
    for (int i = 0; i < n; i++) {
        if (scanf("%d %d", &jobs[i].deadline, &jobs[i].profit) == EOF) return 0;
        if (jobs[i].deadline > maxDeadline) {
            maxDeadline = jobs[i].deadline;
        }
    }
    
    qsort(jobs, n, sizeof(Job), compare);
    
    bool* slots = (bool*)calloc((maxDeadline + 1), sizeof(bool));
    int totalProfit = 0;
    
    for (int i = 0; i < n; i++) {
        for (int j = jobs[i].deadline; j > 0; j--) {
            if (!slots[j]) {
                slots[j] = true;
                totalProfit += jobs[i].profit;
                break;
            }
        }
    }
    
    printf("%d\\n", totalProfit);
    
    free(jobs);
    free(slots);
    return 0;
}`,
      cpp: `#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

struct Job {
    int deadline;
    int profit;
};

bool compare(Job a, Job b) {
    return a.profit > b.profit;
}

int main() {
    int n;
    if (cin >> n) {
        vector<Job> jobs(n);
        int maxDeadline = 0;
        for (int i = 0; i < n; i++) {
            cin >> jobs[i].deadline >> jobs[i].profit;
            maxDeadline = max(maxDeadline, jobs[i].deadline);
        }
        
        sort(jobs.begin(), jobs.end(), compare);
        
        vector<bool> slots(maxDeadline + 1, false);
        int totalProfit = 0;
        
        for (int i = 0; i < n; i++) {
            for (int j = jobs[i].deadline; j > 0; j--) {
                if (!slots[j]) {
                    slots[j] = true;
                    totalProfit += jobs[i].profit;
                    break;
                }
            }
        }
        cout << totalProfit << endl;
    }
    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    static class Job {
        int deadline, profit;
        Job(int d, int p) {
            this.deadline = d;
            this.profit = p;
        }
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {
            int n = sc.nextInt();
            List<Job> jobs = new ArrayList<>();
            int maxDeadline = 0;
            for (int i = 0; i < n; i++) {
                int d = sc.nextInt();
                int p = sc.nextInt();
                jobs.add(new Job(d, p));
                if (d > maxDeadline) maxDeadline = d;
            }
            
            jobs.sort((a, b) -> b.profit - a.profit);
            boolean[] slots = new boolean[maxDeadline + 1];
            int totalProfit = 0;
            
            for (Job job : jobs) {
                for (int j = job.deadline; j > 0; j--) {
                    if (!slots[j]) {
                        slots[j] = true;
                        totalProfit += job.profit;
                        break;
                    }
                }
            }
            System.out.println(totalProfit);
        }
    }
}`
    },
    hints: ['Sort the jobs in descending order of profit.', 'For each job, allocate it the latest available slot that is before or equal to its deadline.'],
    acceptanceRate: 59.8
  }
];

module.exports = codingProblems;
