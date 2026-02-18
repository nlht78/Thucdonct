import { useState, useEffect, useCallback } from 'react';
import { ShoppingItem } from '@/types';
import { StorageService } from '@/lib/storage';
import { ValidationService } from '@/lib/validation';

/**
 * Custom hook for managing shopping items
 * Requirements: 1.1, 1.4, 1.5, 2.1, 2.2, 8.1
 */
export function useShoppingItems() {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load items from Local Storage on mount
  useEffect(() => {
    try {
      const savedItems = StorageService.getItems();
      setItems(savedItems);
    } catch (error) {
      console.error('Failed to load items from storage:', error);
      // Start with empty list if loading fails
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Auto-save to Local Storage whenever items change
  useEffect(() => {
    if (!isLoading) {
      try {
        StorageService.saveItems(items);
      } catch (error) {
        console.error('Failed to save items to storage:', error);
      }
    }
  }, [items, isLoading]);

  /**
   * Add a new item to the list
   * Requirements: 1.1, 1.4
   * 
   * @param name - Item name
   * @param price - Item price
   * @returns The newly created item, or null if validation fails
   */
  const addItem = useCallback((name: string, price: number): ShoppingItem | null => {
    // Validate name
    const nameValidation = ValidationService.validateItemName(name);
    if (!nameValidation.valid) {
      return null;
    }

    // Validate price
    const priceValidation = ValidationService.validatePrice(price);
    if (!priceValidation.valid) {
      return null;
    }

    const newItem: ShoppingItem = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: name.trim(),
      price: priceValidation.value!,
      createdAt: new Date().toISOString(),
    };

    setItems(prevItems => [...prevItems, newItem]);
    return newItem;
  }, []);

  /**
   * Update an existing item
   * Requirements: 2.2
   * 
   * @param id - Item ID
   * @param updates - Partial item updates
   * @returns true if update succeeded, false otherwise
   */
  const updateItem = useCallback((id: string, updates: Partial<ShoppingItem>): boolean => {
    // Validate updates if they include name or price
    if (updates.name !== undefined) {
      const nameValidation = ValidationService.validateItemName(updates.name);
      if (!nameValidation.valid) {
        return false;
      }
      updates.name = updates.name.trim();
    }

    if (updates.price !== undefined) {
      const priceValidation = ValidationService.validatePrice(updates.price);
      if (!priceValidation.valid) {
        return false;
      }
      updates.price = priceValidation.value!;
    }

    // Check if item exists first
    const itemExists = items.some(item => item.id === id);
    if (!itemExists) {
      return false;
    }

    setItems(prevItems => {
      const itemIndex = prevItems.findIndex(item => item.id === id);
      if (itemIndex === -1) {
        return prevItems;
      }

      const updatedItems = [...prevItems];
      updatedItems[itemIndex] = {
        ...updatedItems[itemIndex],
        ...updates,
      };
      return updatedItems;
    });

    return true;
  }, [items]);

  /**
   * Delete an item from the list
   * Requirements: 2.1
   * 
   * @param id - Item ID to delete
   * @returns true if item was deleted, false if not found
   */
  const deleteItem = useCallback((id: string): boolean => {
    // Check if item exists first
    const itemExists = items.some(item => item.id === id);
    if (!itemExists) {
      return false;
    }

    setItems(prevItems => prevItems.filter(item => item.id !== id));
    return true;
  }, [items]);

  /**
   * Clear all items from the list
   * Requirements: 8.4
   */
  const clearAll = useCallback(() => {
    setItems([]);
    try {
      StorageService.clearItems();
    } catch (error) {
      console.error('Failed to clear storage:', error);
    }
  }, []);

  /**
   * Calculate total cost of all items
   * Requirements: 1.5
   * 
   * @returns Total cost
   */
  const calculateTotal = useCallback((): number => {
    return items.reduce((sum, item) => sum + item.price, 0);
  }, [items]);

  return {
    items,
    isLoading,
    addItem,
    updateItem,
    deleteItem,
    clearAll,
    calculateTotal,
  };
}
