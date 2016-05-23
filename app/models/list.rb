class List < ActiveRecord::Base
  has_many :items, dependent: :destroy

  default_scope { order('created_at DESC') }

end
