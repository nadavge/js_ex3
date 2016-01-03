
What was hard?

--- Thinking about smart seperation between different components to allow
    flexibility and readability was a major consideration and took us quite
    some time and effort.

--- Writing things to work asynchrounusly is new to us and took some thought
    to acquire.

What was fun?

--- Javascript is a cool and flexible language, it's nice working with it :)

What did you do to make the server efficient?

--- We tried to divide things to seperate purpose functions and object, to
    allow us to see more vividly where the code can be optimized. By this
    seperation, we managed to use asynchronus functions where we found useful.

How did you test your server?

--- As a normal test, we've tested either a case in which the file is actually present,
    a case in which the file shouldn't be found, a case in which the access to the file
    is forbidden, and finally a case of internal error.
    In our load tests, we actually tried several amount of get requests together,
    when implementing it in a for look is valid because the get requests are a-sync.
