// Plain validation functions for the listing form. No library.
// Each field validator returns an error message, or undefined if valid.

import type { City, Currency } from "./types";

export type ListingFormValues = {
  city: City | "";
  neighbourhood: string;
  rent: string;
  currency: Currency;
  rooms: string;
  availableFrom: string;
  availableUntil: string;
  openEnded: boolean;
  description: string;
};

export type ListingFormErrors = Partial<
  Record<keyof ListingFormValues, string>
>;

export function validateCity(city: string): string | undefined {
  if (!city) return "Please choose a city.";
  return undefined;
}

export function validateNeighbourhood(value: string): string | undefined {
  if (!value.trim()) return "Neighbourhood is required.";
  return undefined;
}

export function validateRent(value: string): string | undefined {
  if (!value.trim()) return "Monthly rent is required.";
  const rent = Number(value);
  if (Number.isNaN(rent)) return "Rent must be a number.";
  if (rent <= 0) return "Rent must be greater than 0.";
  if (rent >= 10000) return "Rent must be less than 10 000.";
  return undefined;
}

export function validateRooms(value: string): string | undefined {
  if (!value.trim()) return "Number of rooms is required.";
  const rooms = Number(value);
  if (!Number.isInteger(rooms)) return "Rooms must be a whole number.";
  if (rooms < 1 || rooms > 10) return "Rooms must be between 1 and 10.";
  return undefined;
}

export function validateAvailableFrom(value: string): string | undefined {
  if (!value) return "Available-from date is required.";
  return undefined;
}

export function validateAvailableUntil(
  value: string,
  availableFrom: string,
  openEnded: boolean
): string | undefined {
  if (openEnded) return undefined;
  if (!value) return undefined; // optional field
  if (availableFrom && value <= availableFrom) {
    return "Available-until date must be after the available-from date.";
  }
  return undefined;
}

export function validateDescription(value: string): string | undefined {
  const length = value.trim().length;
  if (length < 20) return "Description must be at least 20 characters.";
  if (length > 2000) return "Description must be at most 2000 characters.";
  return undefined;
}

export function validateListingForm(
  values: ListingFormValues
): ListingFormErrors {
  const errors: ListingFormErrors = {};

  const cityError = validateCity(values.city);
  if (cityError) errors.city = cityError;

  const neighbourhoodError = validateNeighbourhood(values.neighbourhood);
  if (neighbourhoodError) errors.neighbourhood = neighbourhoodError;

  const rentError = validateRent(values.rent);
  if (rentError) errors.rent = rentError;

  const roomsError = validateRooms(values.rooms);
  if (roomsError) errors.rooms = roomsError;

  const availableFromError = validateAvailableFrom(values.availableFrom);
  if (availableFromError) errors.availableFrom = availableFromError;

  const availableUntilError = validateAvailableUntil(
    values.availableUntil,
    values.availableFrom,
    values.openEnded
  );
  if (availableUntilError) errors.availableUntil = availableUntilError;

  const descriptionError = validateDescription(values.description);
  if (descriptionError) errors.description = descriptionError;

  return errors;
}

export function isListingFormValid(values: ListingFormValues): boolean {
  return Object.keys(validateListingForm(values)).length === 0;
}
