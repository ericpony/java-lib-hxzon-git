## Converting List to Array

| | List.of  |  Arrays.asList |
|-|----------|----------------|
| Use case | small/static data | large/dynamic data |
| implementation | fixed-sized list | a [wrapper](https://grepcode.com/file/repository.grepcode.com/java/root/jdk/openjdk/6-b14/java/util/Arrays.java#3361) of the original array |
| [Overhead](https://youtu.be/q6zF3vf114M?t=49m48s) | low | high |
| Is list mutable? | No | Yes |
| Is list thread-safe? | Yes | No |
| Allow null element? | No | Yes |

A general advice is to use List.of as a container to convert the working array to the final results.

|      Operations      | SingletonList | List.of | Arrays.asList | ArrayList |
|----------------------|---------------|----------|----------------|---------------------|
|          add         |       ❌      |     ❌  |        ❌      |          ✔️          |
|        addAll        |       ❌      |     ❌  |        ❌      |          ✔️          |
|         clear        |       ❌      |     ❌  |        ❌      |          ✔️          |
|        remove        |       ❌      |     ❌  |        ❌      |          ✔️          |
|       removeAll      |       ❗️       |     ❌   |        ❗️       |          ✔️          |
|       retainAll      |       ❗️       |     ❌  |        ❗️        |          ✔️          |
|      replaceAll      |       ❌      |     ❌  |        ✔️       |          ✔️          |
|          set         |       ❌      |     ❌  |        ✔️       |          ✔️          |
|         sort         |       ✔️       |     ❌   |        ✔️      |          ✔️          |
|  remove on iterator  |       ❌      |     ❌  |        ❌      |          ✔️          |
| set on list-iterator |       ❌      |     ❌  |        ✔️       |          ✔️          |

✔️ means the method is supported

❌ means that calling this method will throw an UnsupportedOperationException

❗️ means the method is supported only if the method's arguments do not cause a mutation, 
e.g., `Collections.singletonList("foo").retainAll("foo")` is OK but 
`Collections.singletonList("foo").retainAll("bar")` throws an UnsupportedOperationException

### References
https://dzone.com/articles/singleton-list-showdown-collectionssingletonlist-v
