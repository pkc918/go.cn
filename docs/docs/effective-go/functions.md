---
title: 函数
lang: zh-CN
---

# 函数

## 多返回值

Go 与众不同的特性之一就是函数和方法可返回多个值。这种形式可以改善 C 中一些笨拙的习惯： 将错误值返回（例如用 -1 表示 EOF）和修改通过地址传入的实参。

在 C 中，写入操作发生的错误会用一个负数标记，而错误码会隐藏在某个不确定的位置。 而在 Go 中，Write 会返回写入的字节数以及一个错误： “是的，您写入了一些字节，但并未全部写入，因为设备已满”。 在 os 包中，File.Write 的签名为：

```go
func (file *File) Write(b []byte) (n int, err error)
```

正如文档所述，它返回写入的字节数，并在 n != len(b) 时返回一个非 nil 的 error 错误值。 这是一种常见的编码风格，更多示例见错误处理一节。

我们可以采用一种简单的方法。来避免为模拟引用参数而传入指针。 以下简单的函数可从字节数组中的特定位置获取其值，并返回该数值和下一个位置。

```go
func nextInt(b []byte, i int) (int, int) {
	for ; i < len(b) && !isDigit(b[i]); i++ {
	}
	x := 0
	for ; i < len(b) && isDigit(b[i]); i++ {
		x = x*10 + int(b[i]) - '0'
	}
	return x, i
}
```

你可以像下面这样，通过它扫描输入的切片 b 来获取数字。

```go
	for i := 0; i < len(b); {
		x, i = nextInt(b, i)
		fmt.Println(x)
	}
```

## 可命名结果形参

Go 函数的返回值或结果 “形参” 可被命名，并作为常规变量使用，就像传入的形参一样。 命名后，一旦该函数开始执行，它们就会被初始化为与其类型相应的零值； 若该函数执行了一条不带实参的 return 语句，则结果形参的当前值将被返回。

此名称不是强制性的，但它们能使代码更加简短清晰：它们就是文档。若我们命名了 nextInt 的结果，那么它返回的 int 就值如其意了。

```go
func nextInt(b []byte, pos int) (value, nextPos int) {
```

由于被命名的结果已经初始化，且已经关联至无参数的返回，它们就能让代码简单而清晰。 下面的 io.ReadFull 就是个很好的例子：

```go
func ReadFull(r Reader, buf []byte) (n int, err error) {
	for len(buf) > 0 && err == nil {
		var nr int
		nr, err = r.Read(buf)
		n += nr
		buf = buf[nr:]
	}
	return
}
```
## defer

Go 的 defer 语句用于预设一个函数调用（即推迟执行函数）， 该函数会在执行 defer 的函数返回之前立即执行。它显得非比寻常， 但却是处理一些事情的有效方式，例如无论以何种路径返回，都必须释放资源的函数。 典型的例子就是解锁互斥和关闭文件。

```go
// Contents 将文件的内容作为字符串返回。
func Contents(filename string) (string, error) {
	f, err := os.Open(filename)
	if err != nil {
		return "", err
	}
	defer f.Close()  // f.Close 会在我们结束后运行。

	var result []byte
	buf := make([]byte, 100)
	for {
		n, err := f.Read(buf[0:])
		result = append(result, buf[0:n]...) // append 将在后面讨论。
		if err != nil {
			if err == io.EOF {
				break
			}
			return "", err  // 我们在这里返回后，f 就会被关闭。
		}
	}
	return string(result), nil // 我们在这里返回后，f 就会被关闭。
}
```

推迟诸如 Close 之类的函数调用有两点好处：第一， 它能确保你不会忘记关闭文件。如果你以后又为该函数添加了新的返回路径时， 这种情况往往就会发生。第二，它意味着 “关闭” 离 “打开” 很近， 这总比将它放在函数结尾处要清晰明了。

被推迟函数的实参（如果该函数为方法则还包括接收者）在推迟执行时就会被求值， 而不是在调用执行时才求值。这样不仅无需担心变量值在函数执行时被改变， 同时还意味着单个被推迟的调用可推迟多个函数的执行。下面是个简单的例子。

```go
for i := 0; i < 5; i++ {
	defer fmt.Printf("%d ", i)
}
```

被推迟的函数按照后进先出（LIFO）的顺序执行，因此以上代码在函数返回时会打印 4 3 2 1 0。一个更具实际意义的例子是通过一种简单的方法， 用程序来跟踪函数的执行。我们可以编写一对简单的跟踪例程：

```go
func trace(s string)   { fmt.Println("entering:", s) }
func untrace(s string) { fmt.Println("leaving:", s) }

// 像这样使用它们：
func a() {
	trace("a")
	defer untrace("a")
	// 做一些事情....
}
```

我们可以充分利用这个特点，即被推迟函数的实参在 defer 执行时就会被求值。 跟踪例程可针对反跟踪例程设置实参。以下例子：

```go
func trace(s string) string {
	fmt.Println("entering:", s)
	return s
}

func un(s string) {
	fmt.Println("leaving:", s)
}

func a() {
	defer un(trace("a"))
	fmt.Println("in a")
}

func b() {
	defer un(trace("b"))
	fmt.Println("in b")
	a()
}

func main() {
	b()
}
```

会打印

```go
entering: b
in b
entering: a
in a
leaving: a
leaving: b
```

对于习惯其它语言中块级资源管理的程序员，defer 似乎有点怪异， 但它最有趣而强大的应用恰恰来自于其基于函数而非块的特点。在 panic 和 recover 这两节中，我们将看到关于它可能性的其它例子。
