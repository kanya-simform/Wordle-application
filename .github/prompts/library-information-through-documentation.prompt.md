---
name: library-information-through-documentation-prompt
description: This prompt is used to extract information about a library or framework by analyzing its documentation.
model: GPT-4.1
tools: [read, search, firecrawl/*]
argument-hint: Try `Please provide information about the React library based on its documentation`
agent: Ask
---

When trying to understand a library or framework, it's essential to analyze its documentation thoroughly. Here are some steps to help you extract valuable information from the documentation:

1. Please ensure you have access to firecrawl mcp server and the necessary permissions to use the firecrawl/\* tools for gathering information from external sources related to the library.
2. Identify the main features and functionalities of the library. Look for sections that describe what the library does and how it can be used.
3. Pay attention to the installation and setup instructions. This will give you insights into the dependencies and environment requirements for using the library.
4. Explore the API reference to understand the available classes, methods, and properties. This will help you grasp how to interact with the library and utilize its features effectively.
5. Look for examples and tutorials provided in the documentation. These can offer practical insights into how to implement the library in real-world scenarios and can help you understand common use cases.
6. Use the "read" tool to analyze the documentation and extract relevant information, and the "search" tool to find specific details or examples within the documentation. Additionally, the "firecrawl/\*" tool can be used to gather information from external sources related to the library, such as community forums, blogs, and GitHub repositories. This can provide you with a broader understanding of the library's usage and best practices.
   By following these steps, you can gain a comprehensive understanding of the library or framework and how to effectively utilize it in your projects.
