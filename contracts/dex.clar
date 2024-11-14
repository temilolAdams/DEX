;; contracts/dax.clar
(define-fungible-token test-token)

(define-public (mint (amount uint) (recipient principal))
  (ft-mint? test-token amount recipient)
)

(define-public (transfer (amount uint) (sender principal) (recipient principal))
  (ft-transfer? test-token amount sender recipient)
)

(define-read-only (get-balance (account principal))
  (ft-get-balance test-token account)
)

(define-read-only (get-total-supply)
  (ft-get-supply test-token)
)
