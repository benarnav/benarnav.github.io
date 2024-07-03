---
title: Optimizing Tokenization for Large Language Models
layout: page
---

## tl;dr

I was implementing an LLM from scratch using only research papers and was frustrated by the slow performance of my Python tokenizer, so I built one in C. `bytephase` is a high-performance byte-pair tokenizer that uses a hybrid architecture with a Python API and C extensions for core operations. 

It uses a trie-based encoding approach to achieve tokenization speeds of 2.41M tokens/sec, significantly outperforming many existing solutions.  Training the tokenizer is over 3,000 times faster compared to a reference Python implementation by [Andrej Karpathy](https://github.com/karpathy/minbpe){:target="_blank" rel="noopener"}. This project demonstrates my ability to optimize critical ML pipeline components and implement novel solutions based on academic papers. The development process provided deep insights into low-level LLM operations, demonstrating expertise in both theoretical and practical aspects of AI system optimization.

## Background

Byte-pair encoding (BPE) is a crucial component in modern natural language processing, particularly for training large language models. It was popularized by [Sennrich et al.](https://arxiv.org/pdf/1508.07909){:target="_blank" rel="noopener"} and further adapted to merge at the byte level in the [GPT-2 paper](https://cdn.openai.com/better-language-models/language_models_are_unsupervised_multitask_learners.pdf){:target="_blank" rel="noopener"}: *Language Models are Unsupervised Multitask Learners*. This algorithm is used to train some of the most popular LLMs, making it a fundamental building block in AI language understanding.

As part of a project to implement GPT-2 from scratch using only research papers as reference, I identified the need for a tokenizer that could efficiently handle large datasets quickly without sacrificing flexibility. While my initial Python implementation worked and satisfied the requirements in the paper, it was painfully slow. I had learned how the algorithm worked, but if I ever wanted to train my LLM, I was staring down a major bottleneck before I even started building any of the model architecture.

Enter: The C Programming Language. It was the first language I learned and I've always been fond of it, despite the critics, and it would be simple to integrate into the rest of my Python codebase.

## The Algorithm

The byte-pair encoding algorithm proposed by Sennrich et al. iteratively merges the most frequent pair of characters or character sequences, effectively learning a vocabulary of subword units. This approach allows the model to handle rare words and morphologically rich languages more effectively. The GPT-2 paper adapted this technique to operate directly on bytes rather than Unicode characters, introducing a clever twist: by processing raw bytes, the tokenizer can handle any string of text without the need for pre-processing, effectively creating a universal tokenizer. This byte-level BPE maintains the benefits of subword tokenization while eliminating issues with different encodings or languages, making it particularly well-suited for training large, multilingual language models.

The BPE algorithm begins by splitting words into individual bytes and counting their frequencies. It then iteratively merges the most frequent adjacent pair of tokens, creating a new token from this pair, and adds it to the vocabulary. This process continues until a desired vocabulary size is reached or no more merges are possible, resulting in a final vocabulary of subword units that efficiently represents the training corpus.

## C Implementation

The core of `bytephase` is built around training the tokenizer to a target vocabulary and then encoding text into token IDs for use in LLM training and inference, both of which are implemented as C extensions of Python. A trie data structure for efficient storage and rapid lookup of tokens, which is crucial for high-speed encoding. The trie is constructed during the training phase or when a training file is loaded, while decoding operations are handled by a lookup table.

This trie structure allows for `O(n)` time complexity for both insertion and search operations, where n is the length of the token. This is a significant improvement over naive string matching approaches, especially for large vocabularies.

Many BPE implementations recalculate byte-pair statistics for the entire training corpus after each merge step. This is highly inefficient and I instead update statistics on the fly as adjacent bytes are merged into a single token. Once we find a pair to be merged, there are a maximum of four operations required:   

Update left context (if exists):
1. Decrement the frequency of the bigram formed by the left token and the first token of the pair.
1. Increment the frequency of the bigram formed by the left token and the new merged token.   

Update right context (if exists):   

3. Decrement the frequency of the bigram formed by the second token of the pair and the right token.   
4. Increment the frequency of the bigram formed by the new merged token and the right token.

```c
if (*unigram_1 == (*max_node)->bigram[0] && *unigram_2 == (*max_node)->bigram[1])
{
    if (unigram_L != unigram_1)
    {
        unigram_L = unigram_1 - 1;
        update_bigram_table(*unigram_L,*unigram_1, -1 * text_chunk_node ->count, bigram_table);
        update_bigram_table(*unigram_L, token_idx, text_chunk_node ->count, bigram_table);
    }
    unigram_R = unigram_2 + 1;
    
    if (*unigram_R != 0)
    {
        update_bigram_table(*unigram_2,*unigram_R, -1 * text_chunk_node ->count, bigram_table);
        update_bigram_table(token_idx, *unigram_R, text_chunk_node ->count, bigram_table);
    }
    *unigram_1 = token_idx;
    // ... (memory management code omitted for brevity)
}
```

Finally we replace the first token of the matched pair with the new merged token ID and shift the rest of the byte sequence one place to account for [two tokens becoming one](https://www.youtube.com/watch?v=FA5jsa1lR9c){:target="_blank" rel="noopener"}. At the end of training, tokens are returned as byte sequences which are reconstituted from the tokens using a depth-first search algorithm.


## Python Integration

To maintain ease of use while leveraging C's performance benefits, I designed a Python API that interfaces with the C extensions. This hybrid approach allows users to interact with the tokenizer using familiar Python syntax while the computationally intensive tasks are handled by C extensions.

The Python `Tokenizer` class acts as a wrapper around the C functions, handling the initialization, training, encoding, and decoding processes. This high-level interface abstracts away the low-level details, providing a seamless user experience. I also leveraged the highly optimized `regex` library (also written in C!) since I found my attempts to implement Perl-style regular expressions in C were slower.

```python
def train(self, file_path: str, vocab_size: int) -> None:
    text_stats = Counter()
    for matches in self._process_chunks(file_path):
        text_stats.update(matches)
    text_stats = dict(text_stats)

    num_merges = vocab_size - 257
    merges = train(text_stats, len(text_stats), num_merges)

    self.decode_dict = {idx: bytes([idx]) for idx in range(256)}
    self.decode_dict[256] = bytes("<|endoftext|>".encode("utf-8"))

    idx = 257
    for merge in merges:
        byte_array = bytes(merge)
        self.decode_dict[idx] = byte_array
        idx += 1

    self._trie = build_trie(self.decode_dict)
```
Despite having 3,000 times more merges, `bytephase` trains faster than a reference pure Python implementation by the AI educator Andrej Karpathy. It also uses less than half the memory since Karpathy's implementation requires reading all text into memory. It's not a perfect comparison, but does demonstrate the efficiency gains achieved through the C extensions.

| Tokenizer                | Merges | Training Time (s) | Memory Usage (MB) |
|--------------------------|--------|------------------:|------------------:|
| minbpe (Karpathy)   |     10 |            212.31 |            755.58 |
| bytephase (Arnav)        |  30,000 |            193.86 |            361.48 |

## Performance Optimization
One of the key challenges in developing `bytephase` was balancing memory usage and speed. To address this, I implemented two distinct encoding modes in the encode method:

1. Training mode: Optimized for lower memory usage, ideal for processing large datasets and conserving memory during training.
1. Inference mode: Maximizes speed at the cost of higher memory consumption, better for real-time applications.

```python
def encode(self, input_text: str, train_mode: bool = True) -> List[int]:
    if train_mode:
        chunk_iterator = self.compiled_pattern.finditer(input_text)
        return encode_train(chunk_iterator, self._trie)
    else:
        text_chunks = self.compiled_pattern.findall(input_text)
        return encode_inference(text_chunks, self._trie)
```
Both encode functions called here are implemented in C and use the trie built during training to transform text into a list of token IDs (integers). The only difference is `encode_train` accepts an generator object and `encode_inference` reads all the text chunks from the regex parsing into memory. All of this is abstracted away in the Python API and the user can switch between the two with a simple boolean flag.

These optimizations resulted in impressive performance metrics:

| Mode      | Speed (tokens/s) | Memory Usage (MB) |
|-----------|------------------:|------------------:|
| Train     |      1.42M |            735 |
| Inference |      2.41M |          19,220 |

These numbers were achieved by testing on the [first 10,000 elements](https://huggingface.co/datasets/NeelNanda/pile-10k){:target="_blank" rel="noopener"} of [The Pile](https://pile.eleuther.ai){:target="_blank" rel="noopener"} dataset, a benchmark commonly used in LLM development.

## Lessons Learned and Future Improvements section:
Developing `bytephase` provided deep insights into the intricacies of tokenization and its impact on LLM performance. Some key takeaways include:

- The importance of efficient data structures in NLP pipelines
- The trade-offs between memory usage and processing speed
- The value of low-level optimizations in high-performance ML systems

Future improvements could include:

- Implementing parallel processing for even faster tokenization, and explore adding GPU support
- Exploring more memory-efficient trie implementations for larger vocabularies
- Adding support for custom tokenization rules to enhance flexibility

## Conclusion
`bytephase` represents not just a high-performance tokenizer, but a deep dive into the fundamentals of LLM preprocessing. By implementing this critical component from scratch, I've gained invaluable insights into the low-level operations that power modern AI systems and important experience balancing theoretical understanding with practical implementation.

As AI systems continue to grow in size and complexity, the ability to optimize and fine-tune every component of the pipeline becomes increasingly crucial. Projects like this showcase the kind of deep, system-level understanding that's essential for pushing the boundaries of what's possible in AI.

For those interested in exploring the code or contributing to the project, `bytephase` is open-source and [available on GitHub](https://github.com/benarnav/bytephase). I welcome feedback, contributions, and discussions on how we can continue to improve and optimize the fundamental building blocks of AI systems.