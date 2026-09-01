import { BUSINESS_CONFIG } from './constants.js';

export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

export const formatDateTime = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export const buildPetWhatsAppLink = (pet) => {
  if (!pet) return `https://wa.me/${BUSINESS_CONFIG.WHATSAPP.replace(/\D/g, '')}`;
  const phone = (pet.whatsAppNumber || BUSINESS_CONFIG.WHATSAPP).replace(/\D/g, '');
  const message = `Hi, I'm interested in ${pet.name}, the ${pet.breed} (ID: ${pet._id || pet.slug}) listed on The Dogs Garage for ${formatCurrency(pet.price)}.`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
};

export const buildCallLink = (phoneNumber) => {
  const number = phoneNumber || BUSINESS_CONFIG.PHONE_RAW;
  return `tel:${number}`;
};
