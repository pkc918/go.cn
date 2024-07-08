---
title: 控制结构
lang: zh-CN
---

# 控制结构

Go 中的结构控制与 C 有许多相似之处，但其不同之处才是独到之处。 Go 不再使用 do 或 while 循环，只有一个更通用的 for；switch 要更灵活一点；if 和 switch 像 for 一样可接受可选的初始化语句； 此外，还有一个包含类型选择和多路通信复用器的新控制结构：select。 其语法也有些许不同：没有圆括号，而其主体必须始终使用大括号括住。

## if

在 Go 中，一个简单的 if 语句看起来像这样：

```go
if x > 0 {
	return y
}
```

强制的大括号促使你将简单的 if 语句分成多行。特别是在主体中包含 return 或 break 等控制语句时，这种编码风格的好处一比便知。

由于 if 和 switch 可接受初始化语句， 因此用它们来设置局部变量十分常见。

```go
if err := file.Chmod(0664); err != nil {
	log.Print(err)
	return err
}
```

在 Go 的库中，你会发现若 if 语句不会执行到下一条语句时，亦即其执行体 以 break、continue、goto 或 return 结束时，不必要的 else 会被省略。

```go
f, err := os.Open(name)
if err != nil {
	return err
}
codeUsing(f)
```

下例是一种常见的情况，代码必须防范一系列的错误条件。若控制流成功继续， 则说明程序已排除错误。由于出错时将以 return 结束， 之后的代码也就无需 else 了。

```go
f, err := os.Open(name)
if err != nil {
	return err
}
d, err := f.Stat()
if err != nil {
	f.Close()
	return err
}
codeUsing(f, d)
```

## redeclaration_and_reassignment

题外话：上一节中最后一个示例展示了短声明 := 如何使用。 调用了 os.Open 的声明为

```go
f, err := os.Open(name)
```

该语句声明了两个变量 f 和 err。在几行之后，又通过

```go
d, err := f.Stat()
```

调用了 f.Stat。它看起来似乎是声明了 d 和 err。 注意，尽管两个语句中都出现了 err，但这种重复仍然是合法的：err 在第一条语句中被声明，但在第二条语句中只是被再次赋值罢了。也就是说，调用 f.Stat 使用的是前面已经声明的 err，它只是被重新赋值了而已。

在满足下列条件时，已被声明的变量 v 可出现在:= 声明中：

- 本次声明与已声明的 v 处于同一作用域中（若 v 已在外层作用域中声明过，则此次声明会创建一个新的变量 §），

- 在初始化中与其类型相应的值才能赋予 v，且

- 在此次声明中至少另有一个变量是新声明的。

这个特性简直就是纯粹的实用主义体现，它使得我们可以很方便地只使用一个 err 值，例如，在一个相当长的 if-else 语句链中， 你会发现它用得很频繁。

§ 值得一提的是，即便 Go 中的函数形参和返回值在词法上处于大括号之外， 但它们的作用域和该函数体仍然相同。

## for

Go 的 for 循环类似于 C，但却不尽相同。它统一了 for 和 while，不再有 do-while 了。它有三种形式，但只有一种需要分号。

```go
// 如同 C 的 for 循环
for init; condition; post { }

// 如同 C 的 while 循环
for condition { }

// 如同 C 的 for(;;) 循环
for { }
```

简短声明能让我们更容易在循环中声明下标变量：

```go
sum := 0
for i := 0; i < 10; i++ {
	sum += i
}
```

若你想遍历数组、切片、字符串或者映射，或从信道中读取消息， range 子句能够帮你轻松实现循环。

```go
for key, value := range oldMap {
	newMap[key] = value
}
```

若你只需要该遍历中的第一个项（键或下标），去掉第二个就行了：

```go
for key := range m {
	if key.expired() {
		delete(m, key)
	}
}
```

若你只需要该遍历中的第二个项（值），请使用空白标识符，即下划线来丢弃第一个值：

```go
sum := 0
for _, value := range array {
	sum += value
}
```

空白标识符还有多种用法，它会在后面的小节中描述。

对于字符串，range 能够提供更多便利。它能通过解析 UTF-8， 将每个独立的 Unicode 码点分离出来。错误的编码将占用一个字节，并以符文 U+FFFD 来代替。 （名称 “符文” 和内建类型 rune 是 Go 对单个 Unicode 码点的称谓。 详情见语言规范）。循环

```go
for pos, char := range "日本 \ x80 語" { // \x80 is an illegal UTF-8 encoding
	fmt.Printf("character %#U starts at byte position %d\n", char, pos)
}
```
打印

```go
character U+65E5 '日' starts at byte position 0
character U+672C '本' starts at byte position 3
character U+FFFD '�' starts at byte position 6
character U+8A9E '語' starts at byte position 7
```

最后，Go 没有逗号操作符，而 ++ 和 -- 为语句而非表达式。 因此，若你想要在 for 中使用多个变量，应采用平行赋值的方式 （因为它会拒绝 ++ 和 --）.

```go
// 反转 a
for i, j := 0, len(a)-1; i < j; i, j = i+1, j-1 {
	a[i], a[j] = a[j], a[i]
}
```

## switch

Go 的 switch 比 C 的更通用。其表达式无需为常量或整数，case 语句会自上而下逐一进行求值直到匹配为止。若 switch 后面没有表达式，它将匹配 true，因此，我们可以将 if-else-if-else 链写成一个 switch，这也更符合 Go 的风格。

```go
func unhex(c byte) byte {
	switch {
	case '0' <= c && c <= '9':
		return c - '0'
	case 'a' <= c && c <= 'f':
		return c - 'a' + 10
	case 'A' <= c && c <= 'F':
		return c - 'A' + 10
	}
	return 0
}
```

switch 并不会自动下溯，但 case 可通过逗号分隔来列举相同的处理条件。

```go
func shouldEscape(c byte) bool {
	switch c {
	case ' ', '?', '&', '=', '#', '+', '%':
		return true
	}
	return false
}
```

尽管它们在 Go 中的用法和其它类 C 语言差不多，但 break 语句可以使 switch 提前终止。不仅是 switch， 有时候也必须打破层层的循环。在 Go 中，我们只需将标签放置到循环外，然后 “跳” 到那里即可。下面的例子展示了二者的用法。

```go
Loop:
	for n := 0; n < len(src); n += size {
		switch {
		case src[n] < sizeOne:
			if validateOnly {
				break
			}
			size = 1
			update(src[n])

		case src[n] < sizeTwo:
			if n+1 >= len(src) {
				err = errShortInput
				break Loop
			}
			if validateOnly {
				break
			}
			size = 2
			update(src[n] + src[n+1]<<shift)
		}
	}
```

当然，continue 语句也能接受一个可选的标签，不过它只适用在循环中。

作为这一节的结束，此程序通过使用两个 switch 语句对字节数组进行比较：

```go
// Compare 按字典顺序比较两个字节切片并返回一个整数。
// 若 a == b，则结果为零；若 a < b；则结果为 -1；若 a > b，则结果为 +1。
func Compare(a, b []byte) int {
	for i := 0; i < len(a) && i < len(b); i++ {
		switch {
		case a[i] > b[i]:
			return 1
		case a[i] < b[i]:
			return -1
		}
	}
	switch {
	case len(a) > len(b):
		return 1
	case len(a) < len(b):
		return -1
	}
	return 0
}
```

## type_switch

switch 也可用于判断接口变量的动态类型。如 类型选择 通过圆括号中的关键字 type 使用类型断言语法。若 switch 在表达式中声明了一个变量，那么该变量的每个子句中都将有该变量对应的类型。在这些 case 中重用一个名字也是符合语义的，实际上是在每个 case 里声明了一个不同类型但同名的新变量。

```go
var t interface{}
t = functionOfSomeType()
switch t := t.(type) {
default:
	fmt.Printf("unexpected type %T", t)       // %T 输出 t 是什么类型
case bool:
	fmt.Printf("boolean %t\n", t)             // t 是 bool 类型
case int:
	fmt.Printf("integer %d\n", t)             // t 是 int 类型
case *bool:
	fmt.Printf("pointer to boolean %t\n", *t) // t 是 *bool 类型
case *int:
	fmt.Printf("pointer to integer %d\n", *t) // t 是 *int 类型
}
```