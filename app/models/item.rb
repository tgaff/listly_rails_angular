class Item < ActiveRecord::Base
  belongs_to :list
  default_scope { order created_at: 'DESC' }
end
