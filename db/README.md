# Database considerations

## room-event

The column _repeat_ is an array of seven booleans representing each day of
the week, with no curly braces or brackets and no spaces. For example:

```javascript
true, false, false, false, true, true, false;
```

Means that this event, in this room, repeats on **monday, friday and**
**saturday**, at the times defined and between the dates defined.

## announcement

_Priority_ can either be **LOW**, **MID** or **HIGH**.

## general

Timestamps are in UNIX time and in UTC. For example, a timestamp with
value **1649290861** represents the time and date **Thursday, April 7,**
**2022 12:21:01 AM, UTC time**
