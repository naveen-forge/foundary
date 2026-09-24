import React, { createContext, useContext, useEffect, useState } from 'react';
import { readList, writeList, makeId } from '../utils/storage';
import { STATUS } from '../data/categories';

const ItemsContext = createContext(null);

const SEED_ITEMS = [
  {
    id: 'seed_1',
    type: STATUS.LOST,
    title: 'Grey tabby cat, blue collar',
    category: 'Pets',
    description:
      'Our cat Biscuit slipped out through the balcony door. Very friendly, answers to his name, wearing a blue collar with a bell.',
    location: 'Maple Street Park',
    date: daysAgo(2),
    image: '',
    status: 'open',
    ownerId: 'seed_owner',
    ownerName: 'Priya S.',
    contactEmail: 'priya.demo@example.com',
    contactPhone: '',
    createdAt: daysAgo(2),
  },
  {
    id: 'seed_2',
    type: STATUS.FOUND,
    title: 'Set of keys with a red keychain',
    category: 'Keys',
    description:
      'Found a set of four keys with a red rubber keychain shaped like a star, near the library entrance steps.',
    location: 'Central Library',
    date: daysAgo(1),
    image: '',
    status: 'open',
    ownerId: 'seed_owner2',
    ownerName: 'Tom H.',
    contactEmail: 'tom.demo@example.com',
    contactPhone: '',
    createdAt: daysAgo(1),
  },
  {
    id: 'seed_3',
    type: STATUS.LOST,
    title: 'Black leather wallet',
    category: 'Bags & Wallets',
    description:
      'Lost my wallet somewhere between the bus stop on 5th Ave and the coffee shop. Has my ID and a couple of cards inside.',
    location: '5th Avenue Bus Stop',
    date: daysAgo(4),
    image: '',
    status: 'resolved',
    ownerId: 'seed_owner3',
    ownerName: 'Alicia M.',
    contactEmail: 'alicia.demo@example.com',
    contactPhone: '',
    createdAt: daysAgo(4),
  },
  {
    id: 'seed_4',
    type: STATUS.FOUND,
    title: 'Blue hardshell suitcase',
    category: 'Other',
    description:
      'A blue hardshell suitcase was left in the taxi rank outside Terminal 2. Turned in to the lost property desk.',
    location: 'Airport Terminal 2',
    date: daysAgo(6),
    image: '',
    status: 'open',
    ownerId: 'seed_owner4',
    ownerName: 'Marcus D.',
    contactEmail: 'marcus.demo@example.com',
    contactPhone: '',
    createdAt: daysAgo(6),
  },
];

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

export function ItemsProvider({ children }) {
  const [items, setItems] = useState([]);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    let stored = readList('items');
    if (stored.length === 0) {
      stored = SEED_ITEMS;
      writeList('items', stored);
    }
    setItems(stored);
    setMessages(readList('messages'));
  }, []);

  function persistItems(next) {
    setItems(next);
    writeList('items', next);
  }

  function persistMessages(next) {
    setMessages(next);
    writeList('messages', next);
  }

  function addItem(data, owner) {
    const item = {
      id: makeId('item'),
      status: 'open',
      createdAt: new Date().toISOString(),
      ownerId: owner.id,
      ownerName: owner.name,
      contactEmail: owner.email,
      contactPhone: owner.phone || '',
      ...data,
    };
    persistItems([item, ...items]);
    return item;
  }

  function updateItem(id, updates) {
    persistItems(items.map((it) => (it.id === id ? { ...it, ...updates } : it)));
  }

  function deleteItem(id) {
    persistItems(items.filter((it) => it.id !== id));
    persistMessages(messages.filter((m) => m.itemId !== id));
  }

  function markResolved(id) {
    updateItem(id, { status: STATUS.RESOLVED });
  }

  function reopenItem(id) {
    updateItem(id, { status: 'open' });
  }

  function getItem(id) {
    return items.find((it) => it.id === id) || null;
  }

  function addMessage({ itemId, fromUserId, fromName, fromContact, text }) {
    const msg = {
      id: makeId('msg'),
      itemId,
      fromUserId,
      fromName,
      fromContact,
      text,
      createdAt: new Date().toISOString(),
    };
    persistMessages([...messages, msg]);
    return msg;
  }

  function messagesForItem(itemId) {
    return messages
      .filter((m) => m.itemId === itemId)
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }

  function itemsByOwner(ownerId) {
    return items.filter((it) => it.ownerId === ownerId);
  }

  return (
    <ItemsContext.Provider
      value={{
        items,
        addItem,
        updateItem,
        deleteItem,
        markResolved,
        reopenItem,
        getItem,
        addMessage,
        messagesForItem,
        itemsByOwner,
      }}
    >
      {children}
    </ItemsContext.Provider>
  );
}

export function useItems() {
  const ctx = useContext(ItemsContext);
  if (!ctx) throw new Error('useItems must be used within ItemsProvider');
  return ctx;
}
