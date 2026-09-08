"use client";

import React from "react";
import GroupClassInvite, { findInviteLink } from "./GroupClassInvite";

/**
 * The body of a chat message.
 *
 * A group-class invite becomes a card showing the offer; every other URL
 * becomes a plain link. Both open in a new tab so the reader never loses the
 * conversation they are in.
 */

/**
 * Split on URLs, keeping them. Built fresh per call rather than shared: a
 * global regex carries `lastIndex` between uses, and reusing one for `.test()`
 * makes alternate matches fail.
 */
const splitOnUrls = (text: string) => text.split(/(https?:\/\/[^\s]+)/g);

/** Text with bare URLs turned into links. */
function Linkified({ text }: { text: string }) {
  const parts = splitOnUrls(text);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("http://") || part.startsWith("https://") ? (
          <a
            key={i}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="underline break-all"
          >
            {part}
          </a>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        ),
      )}
    </>
  );
}

export default function MessageContent({
  content,
  messageId,
}: {
  content: string;
  messageId: string;
}) {
  const invite = findInviteLink(content ?? "");

  if (!invite) {
    return <Linkified text={content ?? ""} />;
  }

  // Keep whatever the tutor typed around the link — often the only context
  // for why it was sent.
  const [before, after] = (content ?? "").split(invite.url);

  return (
    <span className="block">
      {before?.trim() ? (
        <span className="block mb-1">
          <Linkified text={before.trim()} />
        </span>
      ) : null}
      <GroupClassInvite
        url={invite.url}
        token={invite.token}
        messageId={messageId}
      />
      {after?.trim() ? (
        <span className="block mt-1">
          <Linkified text={after.trim()} />
        </span>
      ) : null}
    </span>
  );
}
