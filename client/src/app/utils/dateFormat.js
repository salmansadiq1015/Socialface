import React from "react";
import { format, register } from "timeago.js";

const customLocale = (number, index) => {
  return [
    ["just now", "right now"],
    ["%s minutes", "in %s minutes"],
    ["1 hour", "in 1 hour"],
    ["%s hours", "in %s hours"],
    ["1 day", "in 1 day"],
    ["%s days", "in %s days"],
    ["1 week", "in 1 week"],
    ["%s weeks", "in %s weeks"],
    ["1 month", "in 1 month"],
    ["%s months", "in %s months"],
    ["1 year", "in 1 year"],
    ["%s years", "in %s years"],
  ][index];
};

register("custom-en", customLocale);

function customTimeDifference(date) {
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600)
    return `${Math.floor(diffInSeconds / 60)} minute${
      Math.floor(diffInSeconds / 60) === 1 ? "" : "s"
    }`;
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)} hour${
      Math.floor(diffInSeconds / 3600) === 1 ? "" : "s"
    }`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)} day${
      Math.floor(diffInSeconds / 86400) === 1 ? "" : "s"
    }`;

  return format(date, "custom-en");
}

export default function DateFormat(createdAt) {
  if (!createdAt) {
    return (
      <span className="text-gray-600 text-[12px] dark:text-gray-300">
        Unknown
      </span>
    );
  }

  const date = new Date(createdAt);

  if (isNaN(date)) {
    return (
      <span className="text-gray-600 text-[12px] dark:text-gray-300">
        Invalid Date
      </span>
    );
  }

  return (
    <span className="text-gray-600 text-[12px] dark:text-gray-300">
      {customTimeDifference(date)}
    </span>
  );
}
