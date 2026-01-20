/**
 * State Machine Validators
 * Validates state transitions for Order, Payment, Subscription, etc.
 */

/**
 * Order State Machine
 * Valid transitions:
 * - pending → completed, cancelled
 * - completed → refunded
 * - cancelled → (terminal)
 * - refunded → (terminal)
 */
const ORDER_STATE_MACHINE = {
  pending: ['completed', 'cancelled'],
  completed: ['refunded'],
  cancelled: [],
  refunded: [],
};

/**
 * Payment State Machine
 * Valid transitions:
 * - pending → succeeded, failed
 * - succeeded → refunded
 * - failed → (terminal)
 * - refunded → (terminal)
 */
const PAYMENT_STATE_MACHINE = {
  pending: ['succeeded', 'failed'],
  succeeded: ['refunded'],
  failed: [],
  refunded: [],
};

/**
 * Subscription State Machine
 * Valid transitions:
 * - trialing → active, cancelled
 * - active → cancelled, past_due, unpaid
 * - past_due → active, unpaid, cancelled
 * - unpaid → cancelled
 * - cancelled → (terminal)
 * - ended → (terminal)
 */
const SUBSCRIPTION_STATE_MACHINE = {
  trialing: ['active', 'cancelled'],
  active: ['cancelled', 'past_due', 'unpaid'],
  past_due: ['active', 'unpaid', 'cancelled'],
  unpaid: ['cancelled'],
  cancelled: [],
  ended: [],
};

/**
 * Enrollment State Machine
 * Valid transitions:
 * - enrolled → completed, dropped
 * - completed → (terminal)
 * - dropped → (terminal)
 */
const ENROLLMENT_STATE_MACHINE = {
  enrolled: ['completed', 'dropped'],
  completed: [],
  dropped: [],
};

/**
 * Validate state transition
 * @param {string} currentState - Current state
 * @param {string} newState - New state to transition to
 * @param {Object} stateMachine - State machine definition
 * @returns {boolean} - True if transition is valid
 */
function isValidTransition(currentState, newState, stateMachine) {
  if (!stateMachine[currentState]) {
    return false; // Current state not defined in state machine
  }

  const allowedTransitions = stateMachine[currentState];
  return allowedTransitions.includes(newState);
}

/**
 * Validate Order state transition
 */
function validateOrderTransition(currentState, newState) {
  if (currentState === newState) {
    return { valid: true, message: 'State unchanged' };
  }

  if (!isValidTransition(currentState, newState, ORDER_STATE_MACHINE)) {
    return {
      valid: false,
      message: `Invalid transition from "${currentState}" to "${newState}". Allowed transitions: ${ORDER_STATE_MACHINE[currentState]?.join(', ') || 'none'}`,
    };
  }

  return { valid: true };
}

/**
 * Validate Payment state transition
 */
function validatePaymentTransition(currentState, newState) {
  if (currentState === newState) {
    return { valid: true, message: 'State unchanged' };
  }

  if (!isValidTransition(currentState, newState, PAYMENT_STATE_MACHINE)) {
    return {
      valid: false,
      message: `Invalid transition from "${currentState}" to "${newState}". Allowed transitions: ${PAYMENT_STATE_MACHINE[currentState]?.join(', ') || 'none'}`,
    };
  }

  return { valid: true };
}

/**
 * Validate Subscription state transition
 */
function validateSubscriptionTransition(currentState, newState) {
  if (currentState === newState) {
    return { valid: true, message: 'State unchanged' };
  }

  if (!isValidTransition(currentState, newState, SUBSCRIPTION_STATE_MACHINE)) {
    return {
      valid: false,
      message: `Invalid transition from "${currentState}" to "${newState}". Allowed transitions: ${SUBSCRIPTION_STATE_MACHINE[currentState]?.join(', ') || 'none'}`,
    };
  }

  return { valid: true };
}

/**
 * Validate Enrollment state transition
 */
function validateEnrollmentTransition(currentState, newState) {
  if (currentState === newState) {
    return { valid: true, message: 'State unchanged' };
  }

  if (!isValidTransition(currentState, newState, ENROLLMENT_STATE_MACHINE)) {
    return {
      valid: false,
      message: `Invalid transition from "${currentState}" to "${newState}". Allowed transitions: ${ENROLLMENT_STATE_MACHINE[currentState]?.join(', ') || 'none'}`,
    };
  }

  return { valid: true };
}

/**
 * Middleware factory for state transition validation
 * @param {Function} getCurrentState - Function to get current state from req
 * @param {Function} getNewState - Function to get new state from req.body
 * @param {Function} validator - Validation function
 */
function validateStateTransition(getCurrentState, getNewState, validator) {
  return async (req, res, next) => {
    try {
      const currentState = getCurrentState(req);
      const newState = getNewState(req);

      if (!newState) {
        return next(); // No state change requested
      }

      const validation = validator(currentState, newState);
      if (!validation.valid) {
        return res.status(400).json({
          success: false,
          message: validation.message,
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}

module.exports = {
  ORDER_STATE_MACHINE,
  PAYMENT_STATE_MACHINE,
  SUBSCRIPTION_STATE_MACHINE,
  ENROLLMENT_STATE_MACHINE,
  isValidTransition,
  validateOrderTransition,
  validatePaymentTransition,
  validateSubscriptionTransition,
  validateEnrollmentTransition,
  validateStateTransition,
};

